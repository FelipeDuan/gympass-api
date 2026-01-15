# 📝 Padrões de Nomenclatura

Este documento define os padrões de nomenclatura que **todos os arquivos, pastas, classes e funções** devem seguir, garantindo consistência em toda a codebase.

---

## 📋 Índice

1. [Arquivos](#arquivos)
2. [Pastas](#pastas)
3. [Classes](#classes)
4. [Funções](#funções)
5. [Variáveis e Constantes](#variáveis-e-constantes)
6. [Types e Interfaces](#types-e-interfaces)
7. [Exports](#exports)
8. [Exemplos Práticos](#exemplos-práticos)

---

## Arquivos

### Padrão: `kebab-case.ts` ou `camelCase.ts`

**Regra:** Seguir o padrão do módulo. Se o módulo usa `kebab-case`, todos os arquivos do módulo usam `kebab-case`. Se usa `camelCase`, todos usam `camelCase`.

**Exemplos:**

```typescript
// ✅ Correto - kebab-case (padrão atual)
src/modules/users/users.routes.ts
src/modules/users/users.service.ts
src/modules/users/users.repository.ts

// ✅ Correto - camelCase (se módulo usar camelCase)
src/modules/userManagement/userManagement.routes.ts
src/modules/userManagement/userManagement.service.ts

// ❌ Incorreto - mistura de padrões
src/modules/users/users.Routes.ts  // PascalCase
src/modules/users/users_routes.ts  // snake_case
```

**Padrão Atual:** `kebab-case.ts` (ex: `users.routes.ts`)

---

## Pastas

### Padrão: `kebab-case`

**Regra:** Todas as pastas devem usar `kebab-case`.

**Exemplos:**

```typescript
// ✅ Correto
src/modules/users/
src/infrastructure/monitoring-endpoint/
src/core/shared/utils/

// ❌ Incorreto
src/modules/Users/              // PascalCase
src/infrastructure/monitoringEndpoint/  // camelCase
src/core/shared/utils/         // snake_case
```

---

## Classes

### Padrão: `PascalCase`

**Regra:** Todas as classes devem usar `PascalCase`.

**Exemplos:**

```typescript
// ✅ Correto
export class UsersService { }
export class AuthService { }
export class CircuitBreaker { }

// ❌ Incorreto
export class usersService { }      // camelCase
export class auth_service { }      // snake_case
export class USERS_SERVICE { }    // UPPER_SNAKE_CASE
```

---

## Funções

### Padrão: `camelCase`

**Regra:** Todas as funções devem usar `camelCase`.

**Exemplos:**

```typescript
// ✅ Correto
export function createUsersRepository() { }
export function serializeUser() { }
export function getAuthenticatedUser() { }

// ❌ Incorreto
export function CreateUsersRepository() { }  // PascalCase
export function serialize_user() { }          // snake_case
export function GET_AUTHENTICATED_USER() { }  // UPPER_SNAKE_CASE
```

---

## Variáveis e Constantes

### Variáveis: `camelCase`

**Regra:** Variáveis devem usar `camelCase`.

**Exemplos:**

```typescript
// ✅ Correto
const userName = 'John';
const userEmail = 'john@example.com';
const isAuthenticated = true;

// ❌ Incorreto
const user_name = 'John';        // snake_case
const UserName = 'John';         // PascalCase
const USER_NAME = 'John';        // UPPER_SNAKE_CASE
```

### Constantes: `UPPER_SNAKE_CASE`

**Regra:** Constantes (valores imutáveis) devem usar `UPPER_SNAKE_CASE`.

**Exemplos:**

```typescript
// ✅ Correto
export const CACHE_TTL = {
  USER_LIST: 60 * 5,
  USER_PROFILE: 60 * 10,
} as const;

export const MAX_RETRY_ATTEMPTS = 3;
export const DEFAULT_PAGE_SIZE = 10;

// ❌ Incorreto
export const cacheTtl = { ... };      // camelCase
export const CacheTtl = { ... };      // PascalCase
export const cache_ttl = { ... };     // snake_case
```

**⚠️ IMPORTANTE:** Objetos de constantes podem usar `PascalCase` para a propriedade, mas valores individuais devem ser `UPPER_SNAKE_CASE`:

```typescript
// ✅ Correto
export const CACHE_TTL = {
  USER_LIST: 60 * 5,      // Propriedade em PascalCase
  USER_PROFILE: 60 * 10,
} as const;
```

---

## Types e Interfaces

### Padrão: `PascalCase`

**Regra:** Types e interfaces devem usar `PascalCase`.

**Exemplos:**

```typescript
// ✅ Correto
export type UserDTO = { ... };
export type CreateUserSchema = { ... };
export interface IUsersService { ... }
export interface ICacheService { ... }

// ❌ Incorreto
export type userDTO = { ... };           // camelCase
export type user_dto = { ... };          // snake_case
export interface iUsersService { ... }   // camelCase com 'i' minúsculo
```

**Convenção de Interfaces:**
- Interfaces que representam contratos começam com `I` (ex: `IUsersService`)
- Types não começam com `I` (ex: `UserDTO`)

---

## Exports

### Objetos e Funções: `camelCase`

**Regra:** Exports de objetos e funções devem usar `camelCase`.

**Exemplos:**

```typescript
// ✅ Correto
export const usersService = { ... };
export const authRoutes: FastifyPluginAsyncZod = async (app) => { ... };
export function serializeUser() { ... }

// ❌ Incorreto
export const UsersService = { ... };     // PascalCase
export const users_service = { ... };     // snake_case
```

### Classes: `PascalCase`

**Regra:** Exports de classes devem usar `PascalCase`.

**Exemplos:**

```typescript
// ✅ Correto
export class UsersService { ... }
export class AuthService { ... }

// ❌ Incorreto
export class usersService { ... }        // camelCase
export class users_service { ... }       // snake_case
```

### Types e Interfaces: `PascalCase`

**Regra:** Exports de types e interfaces devem usar `PascalCase`.

**Exemplos:**

```typescript
// ✅ Correto
export type UserDTO = { ... };
export interface IUsersService { ... }

// ❌ Incorreto
export type userDTO = { ... };           // camelCase
export interface iUsersService { ... }   // camelCase
```

---

## Exemplos Práticos

### Exemplo 1: Módulo `users`

```typescript
// ✅ Arquivo: users.service.ts
export class UsersService implements IUsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}

  async findAll(page: number, limit: number) {
    // ...
  }
}

// ✅ Arquivo: users.routes.ts
export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  // ...
};

// ✅ Arquivo: users.dto.ts
export type UserDTO = Prisma.UserGetPayload<{ ... }>;

// ✅ Arquivo: users.serializers.ts
export function serializeUser(user: UserDTO) {
  return { ... };
}

export type UserPublic = ReturnType<typeof serializeUser>;
```

### Exemplo 2: Constantes

```typescript
// ✅ Arquivo: constants.ts
export const CACHE_TTL = {
  USER_LIST: 60 * 5,
  USER_PROFILE: 60 * 10,
} as const;

export const MAX_RETRY_ATTEMPTS = 3;
export const DEFAULT_PAGE_SIZE = 10;
```

### Exemplo 3: Interfaces

```typescript
// ✅ Arquivo: users.service.interface.ts
export interface IUsersService {
  findAll(page: number, limit: number): Promise<...>;
  create(data: CreateUserSchema): Promise<UserDTO>;
}

// ✅ Arquivo: users.dto.ts
export type UserDTO = Prisma.UserGetPayload<{ ... }>;
export type CreateUserSchema = z.infer<typeof createUserSchema.body>;
```

---

## Resumo Rápido

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Arquivos** | `kebab-case.ts` | `users.routes.ts` |
| **Pastas** | `kebab-case` | `modules/users/` |
| **Classes** | `PascalCase` | `UsersService` |
| **Funções** | `camelCase` | `serializeUser()` |
| **Variáveis** | `camelCase` | `userName` |
| **Constantes** | `UPPER_SNAKE_CASE` | `CACHE_TTL` |
| **Types** | `PascalCase` | `UserDTO` |
| **Interfaces** | `PascalCase` (com `I` prefix) | `IUsersService` |
| **Exports (objetos/funções)** | `camelCase` | `usersService` |
| **Exports (classes)** | `PascalCase` | `UsersService` |

---

## Regras de Ouro

1. ✅ **Consistência acima de tudo:** Se um módulo usa um padrão, todos os arquivos do módulo seguem o mesmo padrão
2. ✅ **Classes sempre PascalCase:** Sem exceções
3. ✅ **Funções sempre camelCase:** Sem exceções
4. ✅ **Constantes sempre UPPER_SNAKE_CASE:** Sem exceções
5. ✅ **Interfaces começam com `I`:** Convenção para distinguir de types
6. ✅ **Pastas sempre kebab-case:** Sem exceções

---

## 📚 Referências

- [Padrões de Estrutura de Módulos](./padroes-estrutura-modulos.md) - Estrutura de módulos
- [.cursorrules](../.cursorrules) - Regras globais do projeto

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0

