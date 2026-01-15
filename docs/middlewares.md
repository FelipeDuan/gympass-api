# 🛡️ Middlewares da Aplicação

Este documento explica **detalhadamente** todos os middlewares disponíveis na aplicação, como usá-los, quando aplicá-los e exemplos práticos.

---

## 📋 Índice

1. [O que são Middlewares?](#o-que-são-middlewares)
2. [Middlewares Disponíveis](#middlewares-disponíveis)
3. [Como Usar](#como-usar)
4. [Exemplos Práticos](#exemplos-práticos)
5. [Ordem de Execução](#ordem-de-execução)
6. [Criando Novos Middlewares](#criando-novos-middlewares)

---

## O que são Middlewares?

**Middlewares** são funções que são executadas **antes** do handler principal de uma rota. Eles são usados para:

- ✅ Autenticação (verificar se usuário está logado)
- ✅ Autorização (verificar se usuário tem permissão)
- ✅ Validação adicional (além do Zod)
- ✅ Transformação de dados
- ✅ Logging específico

**Localização:** `src/http/middlewares/`

---

## Middlewares Disponíveis

### 1. `authenticate`

**Propósito:** Verifica se a requisição possui um token JWT válido e autentica o usuário.

**Localização:** `src/http/middlewares/authenticate.ts`

**O que faz:**

1. Extrai o token do header `Authorization: Bearer <token>`
2. Valida o token usando `request.jwtVerify()`
3. Adiciona `request.user` com o payload do token:
   ```typescript
   {
     sub: string;      // ID do usuário
     email: string;    // Email do usuário
     role: Role;       // Role do usuário ('ADMIN' | 'USER')
   }
   ```

**Comportamento:**

- ✅ Token válido → Continua para próximo middleware/handler
- ❌ Token inválido/ausente → Lança `UnauthorizedError` (401)

**Quando usar:**

- Em **qualquer rota** que precisa de autenticação
- **Sempre** antes de `authorize` (se usar)

**Exemplo de uso:**

```typescript
import { authenticate } from '@/http/middlewares';

app.get(
  '/me',
  {
    schema: getProfileSchema,
    preHandler: [authenticate],  // ← Middleware aqui
  },
  async (request, reply) => {
    // request.user está disponível aqui
    const user = getAuthenticatedUser(request);
    // ...
  },
);
```

---

### 2. `authorize`

**Propósito:** Verifica se o usuário autenticado tem uma das roles permitidas.

**Localização:** `src/http/middlewares/authorize.ts`

**O que faz:**

1. Obtém o usuário autenticado via `getAuthenticatedUser(request)`
2. Verifica se `user.role` está na lista de `allowedRoles`
3. Se não estiver, lança `ForbiddenError` (403)

**Comportamento:**

- ✅ Role permitida → Continua para handler
- ❌ Role não permitida → Lança `ForbiddenError` (403)

**⚠️ IMPORTANTE:** `authorize` **sempre** deve vir **depois** de `authenticate`, pois depende de `request.user`.

**Quando usar:**

- Em rotas que precisam de **controle de acesso** por role
- **Sempre** combinado com `authenticate`

**Exemplo de uso:**

```typescript
import { authenticate, authorize } from '@/http/middlewares';

// Apenas ADMIN pode acessar
app.get(
  '/admin/users',
  {
    schema: listUsersSchema,
    preHandler: [authenticate, authorize(['ADMIN'])],  // ← Ambos aqui
  },
  async (request, reply) => {
    // ...
  },
);

// ADMIN ou USER podem acessar
app.get(
  '/users',
  {
    schema: listUsersSchema,
    preHandler: [authenticate, authorize(['ADMIN', 'USER'])],
  },
  async (request, reply) => {
    // ...
  },
);
```

---

### 3. `getAuthenticatedUser`

**Propósito:** Função auxiliar para obter o usuário autenticado de forma type-safe.

**Localização:** `src/http/middlewares/authenticate.ts`

**O que faz:**

- Extrai `request.user` e faz type assertion para `JWTPayload`
- Garante type safety ao acessar dados do usuário

**Quando usar:**

- No handler da rota para obter dados do usuário autenticado
- **Apenas** após `authenticate` ter sido executado

**Exemplo de uso:**

```typescript
import { authenticate, getAuthenticatedUser } from '@/http/middlewares';

app.get(
  '/me',
  {
    schema: getProfileSchema,
    preHandler: [authenticate],
  },
  async (request, reply) => {
    const user = getAuthenticatedUser(request);  // ← Type-safe
    // user.sub, user.email, user.role estão disponíveis
    
    const profile = await usersService.findById(user.sub);
    return reply.send(profile);
  },
);
```

---

## Como Usar

### Estrutura Básica

```typescript
import { authenticate, authorize } from '@/http/middlewares';

app.get(
  '/rota',
  {
    schema: meuSchema,
    preHandler: [authenticate, authorize(['ADMIN'])],  // ← Middlewares aqui
  },
  async (request, reply) => {
    // Handler aqui
  },
);
```

### Ordem dos Middlewares

**Ordem correta:**

```typescript
preHandler: [authenticate, authorize(['ADMIN'])]
```

**Ordem incorreta:**

```typescript
preHandler: [authorize(['ADMIN']), authenticate]  // ❌ ERRO!
// authorize precisa de request.user, que só existe após authenticate
```

---

## Exemplos Práticos

### Exemplo 1: Rota Pública (Sem Autenticação)

```typescript
// src/modules/auth/auth.routes.ts
app.post(
  '/register',
  {
    schema: registerSchema,
    // Sem preHandler = rota pública
  },
  async (request, reply) => {
    const result = await authService.register(app, request.body);
    return reply.status(201).send(result);
  },
);
```

**Quando usar:** Rotas de registro, login, recuperação de senha, etc.

---

### Exemplo 2: Rota Autenticada (Apenas Login)

```typescript
// src/modules/users/users.routes.ts
app.get(
  '/me',
  {
    schema: getProfileSchema,
    preHandler: [authenticate],  // ← Apenas autenticação
  },
  async (request, reply) => {
    const user = getAuthenticatedUser(request);
    const profile = await usersService.findById(user.sub);
    return reply.send(profile);
  },
);
```

**Quando usar:** Rotas que qualquer usuário autenticado pode acessar (seu próprio perfil, suas próprias listas, etc.).

---

### Exemplo 3: Rota com Controle de Acesso (Role Específica)

```typescript
// src/modules/users/users.routes.ts
app.get(
  '/',
  {
    schema: listUsersSchema,
    preHandler: [authenticate, authorize(['ADMIN', 'USER'])],  // ← Ambos
  },
  async (request, reply) => {
    const { page, limit } = request.query;
    const result = await usersService.findAll(page, limit);
    return reply.send(result);
  },
);
```

**Quando usar:** Rotas que precisam de autenticação E verificação de role específica.

---

### Exemplo 4: Rota Apenas para Administradores

```typescript
// Exemplo futuro: módulo de academias
app.post(
  '/gyms',
  {
    schema: createGymSchema,
    preHandler: [authenticate, authorize(['ADMIN'])],  // ← Apenas ADMIN
  },
  async (request, reply) => {
    const result = await gymsService.create(request.body);
    return reply.status(201).send(result);
  },
);
```

**Quando usar:** Operações administrativas (criar academias, validar check-ins, etc.).

---

## Ordem de Execução

Quando múltiplos middlewares são definidos em `preHandler`, eles são executados **na ordem especificada**:

```typescript
preHandler: [authenticate, authorize(['ADMIN'])]
```

**Fluxo:**

1. **`authenticate`** executa primeiro
   - Verifica token JWT
   - Adiciona `request.user`
   - Se falhar → Lança `UnauthorizedError` (401) → **Para aqui**

2. **`authorize`** executa depois (se `authenticate` passou)
   - Verifica role em `request.user.role`
   - Se falhar → Lança `ForbiddenError` (403) → **Para aqui**

3. **Handler** executa (se ambos passaram)
   - `request.user` está disponível
   - Pode usar `getAuthenticatedUser(request)`

**⚠️ IMPORTANTE:** Se qualquer middleware lançar uma exceção, os middlewares seguintes **não são executados** e o handler também não.

---

## Criando Novos Middlewares

### Quando Criar um Novo Middleware?

Crie um novo middleware quando:

- ✅ Precisa de lógica reutilizável em múltiplas rotas
- ✅ Precisa executar antes do handler
- ✅ Precisa modificar `request` ou `reply`
- ✅ Precisa validar algo além do Zod

**⚠️ NÃO crie middleware para:**
- ❌ Lógica específica de uma única rota (coloque no handler)
- ❌ Validação que pode ser feita com Zod (use schemas)
- ❌ Lógica de negócio (coloque no service)

---

### Template de Middleware

```typescript
// src/http/middlewares/meu-middleware.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error';

/**
 * Descrição do que o middleware faz
 *
 * @param request - Request do Fastify
 * @param reply - Reply do Fastify
 * @throws AppError se validação falhar
 *
 * @example
 * ```typescript
 * app.get('/rota', {
 *   preHandler: [meuMiddleware],
 * }, handler);
 * ```
 */
export async function meuMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // 1. Extrair dados necessários
  const algumDado = request.headers['x-custom-header'];

  // 2. Validar
  if (!algumDado) {
    throw new AppError('Missing required header.', 400, 'ERR_MISSING_HEADER');
  }

  // 3. Opcional: Adicionar dados ao request
  (request as unknown as { customData: string }).customData = algumDado;

  // 4. Se tudo OK, continua (não precisa retornar nada)
}
```

---

### Exemplo: Middleware de Rate Limit Customizado

```typescript
// src/http/middlewares/custom-rate-limit.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { TooManyRequestsError } from '../errors/app-error';

// Armazena contadores em memória (em produção, usar Redis)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit customizado por rota específica
 *
 * Limita requisições por IP em uma janela de tempo específica
 */
export function customRateLimit(max: number, windowMs: number) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const ip = request.ip;
    const now = Date.now();

    // Limpa contadores expirados
    if (requestCounts.has(ip)) {
      const data = requestCounts.get(ip)!;
      if (now > data.resetAt) {
        requestCounts.delete(ip);
      }
    }

    // Obtém ou cria contador
    const data = requestCounts.get(ip) || { count: 0, resetAt: now + windowMs };

    // Incrementa contador
    data.count++;

    // Verifica limite
    if (data.count > max) {
      requestCounts.set(ip, data);
      throw new TooManyRequestsError(
        `Too many requests. Limit: ${max} per ${windowMs}ms`,
      );
    }

    // Atualiza contador
    requestCounts.set(ip, data);
  };
}
```

**Uso:**

```typescript
import { customRateLimit } from '@/http/middlewares/custom-rate-limit';

app.post(
  '/sensitive-operation',
  {
    schema: mySchema,
    preHandler: [customRateLimit(5, 60000)],  // 5 req por minuto
  },
  async (request, reply) => {
    // ...
  },
);
```

---

## Resumo

### Middlewares Disponíveis

| Middleware | Propósito | Quando Usar |
|------------|-----------|-------------|
| `authenticate` | Verifica token JWT | Rotas que precisam de autenticação |
| `authorize` | Verifica role do usuário | Rotas com controle de acesso |
| `getAuthenticatedUser` | Obtém usuário autenticado | No handler após `authenticate` |

### Ordem de Uso

```typescript
// ✅ Correto
preHandler: [authenticate, authorize(['ADMIN'])]

// ❌ Incorreto
preHandler: [authorize(['ADMIN']), authenticate]
```

### Regras de Ouro

1. ✅ **Sempre** use `authenticate` antes de `authorize`
2. ✅ Rotas públicas não precisam de `preHandler`
3. ✅ Use `getAuthenticatedUser` no handler para obter dados do usuário
4. ✅ Middlewares devem lançar exceções para interromper o fluxo
5. ✅ Crie novos middlewares apenas quando realmente necessário

---

## 📚 Referências

- [Fluxo Completo da Aplicação](./fluxo-aplicacao.md) - Entenda como middlewares se encaixam no fluxo
- [Error Handling](./error-handling.md) - Como middlewares lançam erros
- [Fastify Hooks Documentation](https://www.fastify.io/docs/latest/Reference/Hooks/) - Documentação oficial

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

