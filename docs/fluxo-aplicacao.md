# 🔄 Fluxo Completo da Aplicação

Este documento explica **detalhadamente** como uma requisição HTTP flui através da aplicação, desde a entrada até a resposta. É essencial para entender a arquitetura e facilitar o desenvolvimento de novas features.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fluxo Detalhado Passo a Passo](#fluxo-detalhado-passo-a-passo)
3. [Exemplo Prático: GET /users](#exemplo-prático-get-users)
4. [Exemplo Prático: POST /auth/register](#exemplo-prático-post-authregister)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Hooks e Middlewares](#hooks-e-middlewares)
7. [Diagrama de Fluxo](#diagrama-de-fluxo)

---

## Visão Geral

A aplicação segue uma arquitetura em **camadas**, onde cada camada tem uma responsabilidade específica:

```
HTTP Request
    ↓
[Plugins Globais] → Helmet, CORS, Rate Limit
    ↓
[Rotas] → Registro e definição de endpoints
    ↓
[Middlewares] → Autenticação e Autorização
    ↓
[Handlers] → Extração de dados da requisição
    ↓
[Services] → Lógica de negócio
    ↓
[Repositories] → Acesso a dados
    ↓
[Database] → PostgreSQL via Prisma
    ↓
[Serializers] → Formatação da resposta
    ↓
HTTP Response
```

---

## Fluxo Detalhado Passo a Passo

### 1. Inicialização da Aplicação (`src/server.ts`)

**O que acontece:**

```typescript
// src/server.ts
async function startServer() {
  await setupPlugins();  // Configura todos os plugins
  app.listen({ port: env.PORT, host: '0.0.0.0' }, ...);
}
```

**Detalhes:**

1. **`setupPlugins()`** é chamado primeiro
   - Registra JWT (`@fastify/jwt`)
   - Cria serviços via Dependency Injection
   - Registra plugins de segurança (Helmet, CORS)
   - Configura rate limiting
   - Registra Swagger para documentação
   - Registra todas as rotas

2. **Servidor inicia** na porta configurada (`env.PORT`)

**Arquivos envolvidos:**
- `src/server.ts` - Entry point
- `src/config/app.ts` - Configuração do Fastify
- `src/config/plugins/*.ts` - Configuração de cada plugin

---

### 2. Requisição HTTP Chega

Quando uma requisição HTTP chega ao servidor, o Fastify processa ela através de uma série de hooks e plugins.

**Ordem de execução:**

#### 2.1. Hook `onRequest` (Coleta de Métricas)

**O que acontece:**

```typescript
// src/config/plugins/routes.config.ts
app.addHook('onRequest', async (request) => {
  request.startTime = Date.now();  // Marca início da requisição
});
```

**Propósito:**
- Coleta métricas de performance
- Armazena timestamp de início para calcular duração

**Arquivos envolvidos:**
- `src/config/plugins/routes.config.ts`

---

#### 2.2. Plugin: Rate Limiting Global

**O que acontece:**

```typescript
// src/config/plugins/rate-limit.config.ts
await app.register(fastifyRateLimit, {
  max: 50,  // 50 requisições
  timeWindow: '1 minute',  // por minuto
});
```

**Propósito:**
- Limita número de requisições por IP
- Protege contra abuso e DDoS
- **Bloqueia requisições excessivas antes de processar**

**Comportamento:**
- Se exceder o limite → Retorna `429 Too Many Requests`
- Se dentro do limite → Continua para próximo passo

**Arquivos envolvidos:**
- `src/config/plugins/rate-limit.config.ts`
- `src/infrastructure/cache/redis.ts` (armazena contadores)

---

#### 2.3. Plugin: CORS

**O que acontece:**

```typescript
// src/config/plugins/cors.config.ts
await app.register(fastifyCors, {
  origin: (origin, cb) => {
    // Verifica se origin está na whitelist
    if (allowedOrigins.includes(origin)) {
      cb(null, true);  // Permite
    } else {
      cb(new Error('Not allowed by CORS'), false);  // Bloqueia
    }
  },
});
```

**Propósito:**
- Controla quais origens podem fazer requisições
- Adiciona headers CORS apropriados
- **Bloqueia requisições de origens não permitidas**

**Comportamento:**
- Se origin não permitida → Retorna erro CORS
- Se origin permitida → Adiciona headers e continua

**Arquivos envolvidos:**
- `src/config/plugins/cors.config.ts`

---

#### 2.4. Plugin: Helmet (Segurança)

**O que acontece:**

```typescript
// src/config/plugins/helmet.config.ts
await app.register(fastifyHelmet, {
  contentSecurityPolicy: { ... },
  crossOriginEmbedderPolicy: false,
  // ... outros headers de segurança
});
```

**Propósito:**
- Adiciona headers HTTP de segurança
- Protege contra XSS, clickjacking, etc.
- **Não bloqueia requisições**, apenas adiciona headers

**Arquivos envolvidos:**
- `src/config/plugins/helmet.config.ts`

---

### 3. Roteamento (Matching de Rotas)

**O que acontece:**

O Fastify verifica qual rota corresponde à URL da requisição:

```typescript
// Exemplo: GET /users
// Fastify encontra: src/modules/users/users.routes.ts
```

**Arquivos envolvidos:**
- `src/config/plugins/routes.config.ts` - Registra todas as rotas
- `src/modules/{module}/{module}.routes.ts` - Definição de rotas

---

### 4. Validação de Schema (Zod)

**O que acontece:**

Antes de executar o handler, o Fastify valida os dados da requisição usando Zod:

```typescript
// src/modules/users/users.routes.ts
app.get(
  '/',
  {
    schema: listUsersSchema,  // Schema Zod
    preHandler: [authenticate, authorize(['ADMIN', 'USER'])],
  },
  async (request, reply) => { ... }
);
```

**O que é validado:**

- **Query params** (`request.query`)
- **Path params** (`request.params`)
- **Body** (`request.body`)
- **Headers** (se especificado no schema)

**Comportamento:**

- ✅ Se válido → Continua para `preHandler`
- ❌ Se inválido → Retorna `400 Bad Request` com detalhes dos erros

**Arquivos envolvidos:**
- `src/modules/{module}/{module}.schemas.ts` - Schemas Zod
- `src/config/app.ts` - Configuração do validator compiler

---

### 5. Pre-Handlers (Middlewares)

**O que acontece:**

Os middlewares definidos em `preHandler` são executados **antes** do handler principal:

```typescript
preHandler: [authenticate, authorize(['ADMIN', 'USER'])]
```

**Ordem de execução:**

#### 5.1. `authenticate` Middleware

**O que acontece:**

```typescript
// src/http/middlewares/authenticate.ts
export async function authenticate(request, reply) {
  await request.jwtVerify();  // Verifica token JWT
}
```

**Propósito:**
- Verifica se há um token JWT válido no header `Authorization`
- Extrai e valida o payload do token
- Adiciona `request.user` com dados do usuário autenticado

**Comportamento:**

- ✅ Token válido → Adiciona `request.user` e continua
- ❌ Token inválido/ausente → Lança `UnauthorizedError` (401)

**Arquivos envolvidos:**
- `src/http/middlewares/authenticate.ts`
- `src/config/jwt.ts` - Configuração JWT

---

#### 5.2. `authorize` Middleware

**O que acontece:**

```typescript
// src/http/middlewares/authorize.ts
export function authorize(allowedRoles: Role[]) {
  return async (request, reply) => {
    const user = getAuthenticatedUser(request);
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Insufficient permissions.');
    }
  };
}
```

**Propósito:**
- Verifica se o usuário autenticado tem uma das roles permitidas
- Usa `request.user.role` (definido pelo `authenticate`)

**Comportamento:**

- ✅ Role permitida → Continua para handler
- ❌ Role não permitida → Lança `ForbiddenError` (403)

**Arquivos envolvidos:**
- `src/http/middlewares/authorize.ts`

---

### 6. Handler da Rota

**O que acontece:**

O handler principal é executado:

```typescript
// src/modules/users/users.routes.ts
async (request, reply) => {
  const { page, limit } = request.query;  // Extrai dados
  const result = await usersService.findAll(page, limit);  // Chama service
  return reply.send(result);  // Retorna resposta
}
```

**Responsabilidades do Handler:**

1. ✅ Extrair dados da requisição (`query`, `params`, `body`)
2. ✅ Chamar métodos do service
3. ✅ Retornar resposta formatada

**O que o Handler NÃO deve fazer:**

- ❌ Lógica de negócio (deve estar no service)
- ❌ Acesso direto ao banco (deve estar no repository)
- ❌ Validação manual (deve usar schemas Zod)
- ❌ Tratamento de erros manual (deve usar error handler global)

**Arquivos envolvidos:**
- `src/modules/{module}/{module}.routes.ts` - Handlers

---

### 7. Service (Lógica de Negócio)

**O que acontece:**

O service contém a **lógica de negócio** da aplicação:

```typescript
// src/modules/users/users.service.ts
async findAll(page: number, limit: number) {
  // 1. Verifica cache
  const cacheKey = `users:list:page:${page}:limit:${limit}`;
  const cached = await this.cache.get(cacheKey);
  if (cached) return cached;

  // 2. Busca dados do repository
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.repository.findAll(skip, limit),
    this.repository.count(),
  ]);

  // 3. Serializa dados
  const result = serializeUsersPage(data, page, total);

  // 4. Atualiza cache
  await this.cache.set(cacheKey, result, CACHE_TTL.USER_LIST);

  return result;
}
```

**Responsabilidades do Service:**

1. ✅ Orquestrar chamadas a repositories
2. ✅ Aplicar regras de negócio
3. ✅ Gerenciar cache
4. ✅ Validar regras de negócio antes de persistir
5. ✅ Lançar exceções customizadas quando necessário

**O que o Service NÃO deve fazer:**

- ❌ Conhecer detalhes de HTTP (FastifyRequest, FastifyReply)
- ❌ Acessar banco diretamente (deve usar repository)
- ❌ Conhecer detalhes de infraestrutura (Redis, Prisma)

**Arquivos envolvidos:**
- `src/modules/{module}/{module}.service.ts` - Services

---

### 8. Repository (Acesso a Dados)

**O que acontece:**

O repository é a **única camada** que acessa o banco de dados:

```typescript
// src/modules/users/users.repository.ts
async findAll(skip: number, take: number): Promise<UserDTO[]> {
  return await prisma.user.findMany({
    skip,
    take,
    select: userSelect,  // Seleção específica (nunca select *)
    orderBy: { created_at: 'desc' },
  });
}
```

**Responsabilidades do Repository:**

1. ✅ Executar queries no banco via Prisma
2. ✅ Retornar DTOs tipados (nunca modelos completos)
3. ✅ Usar `select` específico (nunca `select *`)

**O que o Repository NÃO deve fazer:**

- ❌ Conter lógica de negócio
- ❌ Gerenciar cache
- ❌ Validar regras de negócio

**Arquivos envolvidos:**
- `src/modules/{module}/{module}.repository.ts` - Repositories
- `src/infrastructure/database/prisma.ts` - Cliente Prisma

---

### 9. Database (PostgreSQL via Prisma)

**O que acontece:**

O Prisma executa a query SQL no PostgreSQL:

```typescript
// Prisma converte para SQL:
// SELECT id, name, email, role, created_at 
// FROM users 
// ORDER BY created_at DESC 
// LIMIT 10 OFFSET 0
```

**Arquivos envolvidos:**
- `src/infrastructure/database/prisma.ts` - Cliente Prisma
- `prisma/schema.prisma` - Schema do banco

---

### 10. Serialização (Formatação da Resposta)

**O que acontece:**

Os dados são formatados para a resposta da API:

```typescript
// src/modules/users/users.serializers.ts
export function serializeUser(user: UserDTO) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at.toISOString(),  // Converte Date para string
  };
}
```

**Propósito:**
- Formatar dados para resposta HTTP
- Converter tipos (Date → string ISO)
- Remover campos sensíveis (senhas, etc.)
- Garantir formato consistente

**Arquivos envolvidos:**
- `src/modules/{module}/{module}.serializers.ts` - Serializers

---

### 11. Hook `onResponse` (Métricas Finais)

**O que acontece:**

Antes de enviar a resposta, o hook `onResponse` é executado:

```typescript
// src/config/plugins/routes.config.ts
app.addHook('onResponse', async (request, reply) => {
  const duration = Date.now() - request.startTime;
  const route = request.url.split('?')[0];
  const isError = reply.statusCode >= 400;
  
  metricsCollector.recordRequest(route, duration, isError);
});
```

**Propósito:**
- Coletar métricas de performance
- Registrar erros
- Calcular tempo de resposta

**Arquivos envolvidos:**
- `src/config/plugins/routes.config.ts`
- `src/infrastructure/monitoring/metrics.ts`

---

### 12. Resposta HTTP

**O que acontece:**

O Fastify envia a resposta HTTP ao cliente:

```typescript
return reply.send(result);  // Status 200 por padrão
// ou
return reply.status(201).send(result);  // Status customizado
```

**Formato da resposta:**

```json
{
  "page": 1,
  "total": 10,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Exemplo Prático: GET /users

Vamos seguir uma requisição real passo a passo:

### Requisição

```http
GET /users?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Fluxo Completo

1. **Requisição chega** → Fastify recebe
2. **Hook `onRequest`** → Marca `startTime = Date.now()`
3. **Rate Limit** → Verifica se IP não excedeu 50 req/min ✅
4. **CORS** → Verifica origin permitida ✅
5. **Helmet** → Adiciona headers de segurança ✅
6. **Roteamento** → Encontra `GET /users` em `users.routes.ts` ✅
7. **Validação Zod** → Valida `query: { page: 1, limit: 10 }` ✅
8. **Middleware `authenticate`** → Verifica token JWT ✅
   - Extrai payload: `{ sub: 'user-id', email: 'user@example.com', role: 'USER' }`
   - Adiciona `request.user`
9. **Middleware `authorize`** → Verifica se role `USER` está em `['ADMIN', 'USER']` ✅
10. **Handler executa**:
    ```typescript
    const { page, limit } = request.query;  // { page: 1, limit: 10 }
    const result = await usersService.findAll(1, 10);
    return reply.send(result);
    ```
11. **Service `findAll`**:
    - Verifica cache: `users:list:page:1:limit:10` → Não encontrado
    - Chama `repository.findAll(0, 10)` e `repository.count()`
12. **Repository `findAll`**:
    - Executa Prisma query
    - Retorna `UserDTO[]`
13. **Service serializa**:
    - Chama `serializeUsersPage(data, 1, 10)`
    - Atualiza cache
    - Retorna resultado
14. **Handler retorna** → `reply.send(result)`
15. **Hook `onResponse`** → Registra métricas (duração: 45ms)
16. **Resposta enviada**:
    ```json
    {
      "page": 1,
      "total": 10,
      "data": [...]
    }
    ```

---

## Exemplo Prático: POST /auth/register

### Requisição

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Fluxo Completo

1. **Requisição chega** → Fastify recebe
2. **Hook `onRequest`** → Marca `startTime`
3. **Rate Limit** → Verifica limite específico para `/auth` (5 req/min) ✅
4. **CORS** → Verifica origin ✅
5. **Helmet** → Adiciona headers ✅
6. **Roteamento** → Encontra `POST /auth/register` ✅
7. **Validação Zod** → Valida body:
   - `name`: string min 3 caracteres ✅
   - `email`: formato email válido ✅
   - `password`: string min 6 caracteres ✅
8. **Sem middlewares** → Continua direto para handler
9. **Handler executa**:
    ```typescript
    const result = await authService.register(app, request.body);
    return reply.status(201).send(result);
    ```
10. **Service `register`**:
    - Chama `usersService.create({ name, email, password })`
11. **Service `create`**:
    - Verifica se email já existe → `repository.findByEmail(email)` → Não existe ✅
    - Hash da senha → `argon2.hash(password)`
    - Cria usuário → `repository.create({ name, email, password_hash })`
    - Invalida cache → `cache.invalidateByPattern('users:list:*')`
    - Retorna `UserDTO`
12. **Service `register` continua**:
    - Gera token JWT → `app.jwt.sign({ sub, email, role })`
    - Retorna `{ token, user }`
13. **Handler retorna** → `reply.status(201).send(result)`
14. **Hook `onResponse`** → Registra métricas
15. **Resposta enviada**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
      }
    }
    ```

---

## Tratamento de Erros

### Quando um Erro Ocorre

Se qualquer etapa lançar uma exceção, o **Error Handler Global** captura e trata:

```typescript
// src/http/error-handler.ts
export const errorHandler: FastifyInstance['errorHandler'] = (
  error,
  request,
  reply,
) => {
  // 1. Erros de validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      timestamp: new Date().toISOString(),
      statusCode: 400,
      code: 'ERR_VALIDATION',
      message: 'Validation failed.',
      fields: [...],
    });
  }

  // 2. Erros customizados da aplicação
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      timestamp: new Date().toISOString(),
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    });
  }

  // 3. Erros inesperados (500)
  request.log.error({ error }, 'Internal Server Error');
  return reply.status(500).send({
    timestamp: new Date().toISOString(),
    statusCode: 500,
    code: 'ERR_INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'dev' ? error.message : 'An unexpected error occurred.',
  });
};
```

### Tipos de Erros

1. **ZodError** (400) - Validação falhou
2. **UnauthorizedError** (401) - Token inválido/ausente
3. **ForbiddenError** (403) - Permissão insuficiente
4. **ResourceNotFoundError** (404) - Recurso não encontrado
5. **ConflictError** (409) - Conflito (ex: email duplicado)
6. **AppError** (400) - Erro genérico da aplicação
7. **Erro inesperado** (500) - Erro não tratado

**Arquivos envolvidos:**
- `src/http/error-handler.ts` - Error handler global
- `src/http/errors/app-error.ts` - Classes de erro customizadas

---

## Hooks e Middlewares

### Hooks Globais

Hooks são executados para **todas** as rotas:

1. **`onRequest`** - Antes de processar requisição
   - Coleta métricas de início
   - Localização: `src/config/plugins/routes.config.ts`

2. **`onResponse`** - Antes de enviar resposta
   - Coleta métricas finais
   - Localização: `src/config/plugins/routes.config.ts`

### Middlewares (Pre-Handlers)

Middlewares são executados **por rota**, definidos em `preHandler`:

1. **`authenticate`** - Verifica autenticação JWT
   - Localização: `src/http/middlewares/authenticate.ts`
   - Uso: `preHandler: [authenticate]`

2. **`authorize`** - Verifica permissões (roles)
   - Localização: `src/http/middlewares/authorize.ts`
   - Uso: `preHandler: [authenticate, authorize(['ADMIN'])]`

**⚠️ IMPORTANTE:** `authorize` **sempre** deve vir depois de `authenticate`, pois depende de `request.user`.

---

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Request                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Hook: onRequest                                 │
│              (Coleta startTime)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Plugin: Rate Limit                             │
│              (Limita requisições por IP)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Plugin: CORS                                    │
│              (Verifica origin permitida)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Plugin: Helmet                                  │
│              (Adiciona headers de segurança)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Roteamento                                      │
│              (Encontra rota correspondente)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Validação Zod                                   │
│              (Valida query/params/body)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Pre-Handlers (Middlewares)                     │
│              ┌──────────────────────────────┐               │
│              │ authenticate (JWT)           │               │
│              └──────────────┬───────────────┘                │
│                             │                                 │
│              ┌──────────────▼───────────────┐                │
│              │ authorize (Roles)            │                │
│              └──────────────┬───────────────┘                │
└──────────────────────────────┼──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              Handler da Rota                                 │
│              (Extrai dados, chama service)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Service (Lógica de Negócio)                     │
│              ┌──────────────────────────────┐               │
│              │ Verifica cache                │               │
│              └──────────────┬───────────────┘                │
│                             │                                 │
│              ┌──────────────▼───────────────┐                │
│              │ Chama repository              │                │
│              └──────────────┬───────────────┘                │
│                             │                                 │
│              ┌──────────────▼───────────────┐                │
│              │ Serializa dados               │                │
│              └──────────────┬───────────────┘                │
│                             │                                 │
│              ┌──────────────▼───────────────┐                │
│              │ Atualiza cache                │                │
│              └──────────────┬───────────────┘                │
└──────────────────────────────┼──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              Repository (Acesso a Dados)                     │
│              (Executa queries Prisma)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                           │
│              (Executa SQL)                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Serializer                                      │
│              (Formata resposta)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Hook: onResponse                               │
│              (Coleta métricas finais)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Response                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Próximos Passos

Agora que você entende o fluxo completo:

1. **Leia a documentação de Middlewares** → `docs/middlewares.md`
2. **Veja exemplos de criação de módulos** → `docs/exemplo-modulo-tasks.md` (quando criado)
3. **Explore a estrutura de pastas** → `docs/estrutura-pastas.md` (quando criado)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

