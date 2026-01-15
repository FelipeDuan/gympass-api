# 📁 Padrões de Estrutura de Módulos

Este documento define a estrutura padrão que **todos os módulos** devem seguir, garantindo consistência e facilitando o desenvolvimento.

---

## 📋 Índice

1. [Estrutura Mínima Obrigatória](#estrutura-mínima-obrigatória)
2. [Arquivos Obrigatórios](#arquivos-obrigatórios)
3. [Arquivos Opcionais](#arquivos-opcionais)
4. [Quando Usar Cada Arquivo](#quando-usar-cada-arquivo)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Estrutura de Testes](#estrutura-de-testes)

---

## Estrutura Mínima Obrigatória

**Todos os módulos de domínio** em `src/modules/{module}/` devem seguir esta estrutura:

```
modules/{module}/
├── {module}.routes.ts      # ✅ OBRIGATÓRIO
├── {module}.service.ts     # ✅ OBRIGATÓRIO
├── {module}.repository.ts  # ✅ OBRIGATÓRIO
├── {module}.schemas.ts     # ✅ OBRIGATÓRIO
├── {module}.dto.ts         # ⚠️ OPCIONAL (quando necessário)
├── {module}.serializers.ts # ⚠️ OPCIONAL (quando necessário)
└── __tests__/              # ✅ OBRIGATÓRIO
    ├── unit/               # Testes unitários
    └── integration/        # Testes de integração
```

---

## Arquivos Obrigatórios

### 1. `{module}.routes.ts`

**O que contém:**
- Definição de rotas HTTP
- Registro de handlers
- Aplicação de middlewares
- Schemas de validação

**Padrão de export:**
```typescript
export const {module}Routes: FastifyPluginAsyncZod = async (app) => {
  // Rotas aqui
};
```

**Exemplo:**
```typescript
// src/modules/users/users.routes.ts
export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  const { usersService } = app.services;

  app.get(
    '/',
    {
      schema: listUsersSchema,
      preHandler: [authenticate, authorize(['ADMIN', 'USER'])],
    },
    async (request, reply) => {
      const result = await usersService.findAll(request.query);
      return reply.send(result);
    },
  );
};
```

---

### 2. `{module}.service.ts`

**O que contém:**
- Lógica de negócio
- Orquestração de repositories
- Validações de regras de negócio
- Gerenciamento de cache

**Padrão de export:**
```typescript
export class {Module}Service implements I{Module}Service {
  // Métodos aqui
}
```

**Exemplo:**
```typescript
// src/modules/users/users.service.ts
export class UsersService implements IUsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}

  async findAll(page: number, limit: number) {
    // Lógica de negócio
  }
}
```

---

### 3. `{module}.repository.ts`

**O que contém:**
- Acesso a dados via Prisma
- Queries ao banco de dados
- Retorno de DTOs tipados

**Padrão de export:**
```typescript
export function create{Module}Repository(prisma: PrismaClient) {
  return {
    // Métodos aqui
  };
}

export const {module}Repository = create{Module}Repository(prisma);
```

**Exemplo:**
```typescript
// src/modules/users/users.repository.ts
export function createUsersRepository(prisma: PrismaClient) {
  return {
    async findAll(skip: number, take: number): Promise<UserDTO[]> {
      return await prisma.user.findMany({
        skip,
        take,
        select: userSelect,
      });
    },
  };
}

export const usersRepository = createUsersRepository(prisma);
```

---

### 4. `{module}.schemas.ts`

**O que contém:**
- Schemas Zod para validação
- Schemas de request (body, query, params)
- Schemas de response
- Tipos TypeScript inferidos dos schemas

**Padrão de export:**
```typescript
export const {operation}Schema = {
  tags: ['Module'],
  summary: 'Descrição',
  body: z.object({ ... }),
  response: {
    200: z.object({ ... }),
  },
};

export type {Operation}Schema = z.infer<typeof {operation}Schema.body>;
```

**Exemplo:**
```typescript
// src/modules/users/users.schemas.ts
export const listUsersSchema = {
  tags: ['Users'],
  summary: 'List users with pagination',
  querystring: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
  response: {
    200: paginableSchema(userPublicSchema),
  },
};
```

---

## Arquivos Opcionais

### 5. `{module}.dto.ts` (Opcional)

**Quando usar:**
- Quando precisa definir seleção específica de campos do Prisma (`select`)
- Quando precisa criar tipos baseados em `Prisma.UserGetPayload<{ select: ... }>`
- Quando quer garantir que apenas campos específicos sejam retornados

**Quando NÃO usar:**
- Se não precisa de seleção específica
- Se retorna dados simples que não vêm do Prisma
- Se todos os campos do modelo são necessários

**Padrão de export:**
```typescript
export const {entity}Select = {
  id: true,
  name: true,
  // ... campos específicos
} satisfies Prisma.{Entity}Select;

export type {Entity}DTO = Prisma.{Entity}GetPayload<{
  select: typeof {entity}Select;
}>;
```

**Exemplo:**
```typescript
// src/modules/users/users.dto.ts
export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  created_at: true,
} satisfies Prisma.UserSelect;

export type UserDTO = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;
```

**Módulo `auth` não precisa de `dto.ts` porque:**
- Retorna dados simples (token + user básico)
- Não precisa de seleção específica de campos
- Dados vêm de múltiplas fontes (não apenas Prisma)

---

### 6. `{module}.serializers.ts` (Opcional)

**Quando usar:**
- Quando precisa formatar dados antes de retornar (ex: converter Date para ISO string)
- Quando precisa remover campos sensíveis (ex: senhas)
- Quando precisa transformar estrutura de dados
- Quando quer garantir formato consistente de resposta

**Quando NÃO usar:**
- Se dados já estão no formato correto
- Se não precisa de transformação
- Se retorna dados simples que não precisam formatação

**Padrão de export:**
```typescript
export function serialize{Entity}({entity}: {Entity}DTO) {
  return {
    id: {entity}.id,
    name: {entity}.name,
    created_at: {entity}.created_at.toISOString(), // Formatação
  };
}

export type {Entity}Public = ReturnType<typeof serialize{Entity}>;
```

**Exemplo:**
```typescript
// src/modules/users/users.serializers.ts
export function serializeUser(user: UserDTO) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at.toISOString(), // Date → string
  };
}

export function serializeUsersPage(
  users: UserDTO[],
  page: number,
  total: number,
) {
  return {
    page,
    total,
    data: users.map(serializeUser),
  };
}
```

**Módulo `auth` não precisa de `serializers.ts` porque:**
- Retorna dados simples que não precisam formatação
- Token é string simples
- User object é simples (não tem Date para converter)

---

## Quando Usar Cada Arquivo

### Decisão: Preciso de `dto.ts`?

**✅ SIM, se:**
- Preciso selecionar campos específicos do Prisma
- Quero garantir type safety na seleção
- Não quero retornar todos os campos do modelo

**❌ NÃO, se:**
- Dados não vêm do Prisma
- Preciso de todos os campos do modelo
- Dados são simples e não precisam seleção específica

### Decisão: Preciso de `serializers.ts`?

**✅ SIM, se:**
- Preciso converter tipos (Date → string, etc.)
- Preciso remover campos sensíveis
- Preciso transformar estrutura de dados
- Quero garantir formato consistente

**❌ NÃO, se:**
- Dados já estão no formato correto
- Não preciso de transformação
- Retorno dados simples

---

## Exemplos Práticos

### Exemplo 1: Módulo `users` (Completo)

```
modules/users/
├── users.routes.ts      ✅ Obrigatório
├── users.service.ts     ✅ Obrigatório
├── users.repository.ts  ✅ Obrigatório
├── users.schemas.ts     ✅ Obrigatório
├── users.dto.ts         ✅ Usado (seleção específica de campos)
├── users.serializers.ts ✅ Usado (formatação de Date)
└── __tests__/
    ├── unit/
    └── integration/
```

**Por quê:**
- `dto.ts`: Define `userSelect` para selecionar apenas campos necessários
- `serializers.ts`: Converte `Date` para ISO string e formata resposta paginada

---

### Exemplo 2: Módulo `auth` (Sem DTO e Serializers)

```
modules/auth/
├── auth.routes.ts      ✅ Obrigatório
├── auth.service.ts     ✅ Obrigatório
├── auth.repository.ts  ✅ Obrigatório
├── auth.schemas.ts     ✅ Obrigatório
└── __tests__/
    ├── unit/
    └── integration/
```

**Por quê:**
- Não precisa `dto.ts`: Retorna dados simples (token + user básico)
- Não precisa `serializers.ts`: Dados já estão no formato correto

---

### Exemplo 3: Módulo Futuro `gyms` (Completo)

```
modules/gyms/
├── gyms.routes.ts      ✅ Obrigatório
├── gyms.service.ts     ✅ Obrigatório
├── gyms.repository.ts  ✅ Obrigatório
├── gyms.schemas.ts     ✅ Obrigatório
├── gyms.dto.ts         ✅ Provavelmente necessário (seleção de campos)
├── gyms.serializers.ts ✅ Provavelmente necessário (formatação de coordenadas)
└── __tests__/
    ├── unit/
    └── integration/
```

**Por quê:**
- `dto.ts`: Selecionar apenas campos necessários (não retornar dados sensíveis)
- `serializers.ts`: Formatar coordenadas geográficas, distâncias, etc.

---

## Estrutura de Testes

**Todos os módulos devem ter:**

```
__tests__/
├── unit/              # Testes unitários
│   ├── {module}.service.test.ts
│   └── {module}.repository.test.ts (se necessário)
└── integration/       # Testes de integração
    ├── {module}.routes.test.ts
    └── {module}.repository.test.ts (se necessário)
```

### Quando Criar Cada Tipo de Teste

**Testes Unitários (`unit/`):**
- ✅ Testes de services (lógica de negócio)
- ✅ Testes de repositories (queries isoladas)
- ✅ Testes de funções utilitárias
- ✅ Usar mocks para dependências externas

**Testes de Integração (`integration/`):**
- ✅ Testes de rotas (end-to-end HTTP)
- ✅ Testes de repositories com banco real
- ✅ Testes de fluxos completos
- ✅ Usar banco de dados de teste

---

## Checklist de Validação

Antes de considerar um módulo completo, verificar:

- [ ] Tem `{module}.routes.ts`?
- [ ] Tem `{module}.service.ts`?
- [ ] Tem `{module}.repository.ts`?
- [ ] Tem `{module}.schemas.ts`?
- [ ] Tem `{module}.dto.ts`? (se necessário)
- [ ] Tem `{module}.serializers.ts`? (se necessário)
- [ ] Tem `__tests__/unit/`?
- [ ] Tem `__tests__/integration/`?
- [ ] Exports seguem padrão de nomenclatura?
- [ ] Estrutura está consistente com outros módulos?

---

## 📚 Referências

- [Padrões de Nomenclatura](./padroes-nomenclatura.md) - Padrões de nomes
- [Fluxo Completo da Aplicação](./fluxo-aplicacao.md) - Como módulos se encaixam no fluxo
- [Exemplo de Módulo](./exemplo-modulo-tasks.md) - Exemplo didático completo (quando criado)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

