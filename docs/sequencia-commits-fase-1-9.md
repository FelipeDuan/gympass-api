# Sequência de Commits - Fases 1-9

Esta sequência organiza os commits de forma lógica, agrupando mudanças relacionadas e seguindo Conventional Commits.

## 📦 Commit 1: Estrutura base - Interfaces e tipos compartilhados

**Tipo:** `refactor`  
**Escopo:** `core`

```bash
git add src/core/interfaces/
git add src/core/shared/
git commit -m "refactor(core): criar interfaces e estrutura compartilhada

- Criar interfaces ILogger, ICacheService, ITokenService
- Criar interfaces IUsersRepository, IAuthRepository
- Criar estrutura core/shared/ com constants e utils
- Mover paginations.ts para core/shared/utils/
- Extrair magic numbers para constantes (CACHE_TTL, CIRCUIT_BREAKER, etc)"
```

**Arquivos:**
- `src/core/interfaces/*` (novos)
- `src/core/shared/*` (novos)
- `src/core/utils/paginations.ts` (deletado)

---

## 📦 Commit 2: Infraestrutura - Logger adapter e Token service

**Tipo:** `refactor`  
**Escopo:** `infra`

```bash
git add src/infra/logger/fastify-logger-adapter.ts
git add src/infra/auth/jwt-token-service.ts
git commit -m "refactor(infra): criar adapters e serviços de infraestrutura

- Criar FastifyLoggerAdapter implementando ILogger
- Criar JwtTokenService implementando ITokenService
- Desacoplar infraestrutura de código de negócio"
```

**Arquivos:**
- `src/infra/logger/fastify-logger-adapter.ts` (novo)
- `src/infra/auth/jwt-token-service.ts` (novo)

---

## 📦 Commit 3: Circuit Breaker desacoplado

**Tipo:** `refactor`  
**Escopo:** `core/resilience`

```bash
git add src/core/resilience/circuit-breaker.ts
git commit -m "refactor(core): desacoplar Circuit Breaker do Fastify

- Refatorar CircuitBreaker para receber ILogger via construtor
- Remover dependência direta de app.log
- Melhorar testabilidade e desacoplamento"
```

**Arquivos:**
- `src/core/resilience/circuit-breaker.ts` (modificado)

---

## 📦 Commit 4: Cache Service refatorado

**Tipo:** `refactor`  
**Escopo:** `infra/cache`

```bash
git add src/infra/cache/cache-service.ts
git commit -m "refactor(infra): refatorar Cache Service para usar interfaces

- Converter RedisCacheService para classe implementando ICacheService
- Injetar ILogger e Redis client via construtor
- Remover compatibilidade temporária
- Manter factory function createCacheService"
```

**Arquivos:**
- `src/infra/cache/cache-service.ts` (modificado)

---

## 📦 Commit 5: Repositories com interfaces

**Tipo:** `refactor`  
**Escopo:** `modules`

```bash
git add src/modules/users/users.repository.ts
git add src/modules/auth/auth.repository.ts
git commit -m "refactor(modules): implementar interfaces em repositories

- UsersRepository implementa IUsersRepository
- AuthRepository implementa IAuthRepository
- Garantir type safety e desacoplamento"
```

**Arquivos:**
- `src/modules/users/users.repository.ts` (modificado)
- `src/modules/auth/auth.repository.ts` (modificado)

---

## 📦 Commit 6: Services refatorados para classes

**Tipo:** `refactor`  
**Escopo:** `modules`

```bash
git add src/modules/users/users.service.ts
git add src/modules/auth/auth.service.ts
git commit -m "refactor(modules): converter services para classes com DI

- Converter UsersService para classe implementando IUsersService
- Converter AuthService para classe com DI via construtor
- Injetar dependências (ICacheService, IUsersRepository, etc)
- Remover compatibilidade temporária"
```

**Arquivos:**
- `src/modules/users/users.service.ts` (modificado)
- `src/modules/auth/auth.service.ts` (modificado)

---

## 📦 Commit 7: DI Container e Service Factory

**Tipo:** `feat`  
**Escopo:** `core/di`

```bash
git add src/core/di/
git add src/types/fastify.d.ts
git commit -m "feat(core): implementar DI container simples

- Criar service-factory.ts para centralizar criação de instâncias
- Adicionar app.services ao FastifyInstance
- Resolver dependências automaticamente
- Manter abordagem pragmática sem overengineering"
```

**Arquivos:**
- `src/core/di/*` (novos)
- `src/types/fastify.d.ts` (modificado)

---

## 📦 Commit 8: Rotas atualizadas para usar DI

**Tipo:** `refactor`  
**Escopo:** `modules`

```bash
git add src/modules/users/users.routes.ts
git add src/modules/auth/auth.routes.ts
git commit -m "refactor(modules): atualizar rotas para usar DI container

- Usar app.services em vez de criar instâncias manualmente
- Simplificar código de rotas
- Manter separação de responsabilidades"
```

**Arquivos:**
- `src/modules/users/users.routes.ts` (modificado)
- `src/modules/auth/auth.routes.ts` (modificado)

---

## 📦 Commit 9: Configurações atualizadas

**Tipo:** `refactor`  
**Escopo:** `config`

```bash
git add src/config/app.ts
git add src/config/rate-limit.ts
git add src/modules/users/users.schemas.ts
git commit -m "refactor(config): usar constantes e atualizar configurações

- Atualizar app.ts para usar DI container
- Atualizar rate-limit.ts para usar constantes
- Atualizar users.schemas.ts para usar PAGINATION.DEFAULT_LIMIT"
```

**Arquivos:**
- `src/config/app.ts` (modificado)
- `src/config/rate-limit.ts` (modificado)
- `src/modules/users/users.schemas.ts` (modificado)

---

## 📦 Commit 10: Infraestrutura de testes - Setup e Database

**Tipo:** `test`  
**Escopo:** `tests/setup`

```bash
git add src/__tests__/setup/
git add .gitignore
git commit -m "test(setup): configurar infraestrutura de testes

- Criar global-setup.ts e global-teardown.ts
- Criar vitest-setup.ts com limpeza de banco
- Criar database.ts com testPrisma isolado
- Configurar carregamento de .env.test
- Adicionar .env.test ao .gitignore"
```

**Arquivos:**
- `src/__tests__/setup/*` (novos)
- `.gitignore` (modificado)

---

## 📦 Commit 11: Infraestrutura de testes - Factories e Helpers

**Tipo:** `test`  
**Escopo:** `tests/fixtures`

```bash
git add src/__tests__/fixtures/
git add src/__tests__/helpers/test-helpers.ts
git add src/__tests__/helpers/index.ts
git commit -m "test(fixtures): criar factories e helpers para testes

- Criar factories para User e Gym
- Melhorar test-helpers.ts com mais utilitários
- Criar index.ts para exports centralizados"
```

**Arquivos:**
- `src/__tests__/fixtures/*` (novos/modificados)
- `src/__tests__/helpers/test-helpers.ts` (modificado)
- `src/__tests__/helpers/index.ts` (novo)

---

## 📦 Commit 12: Infraestrutura de testes - Mocks

**Tipo:** `test`  
**Escopo:** `tests/mocks`

```bash
git add src/__tests__/helpers/mocks.ts
git commit -m "test(mocks): criar mocks para todas as interfaces

- Criar mocks para ILogger, ICacheService, ITokenService
- Criar mocks para IUsersRepository, IAuthRepository
- Facilitar testes unitários isolados"
```

**Arquivos:**
- `src/__tests__/helpers/mocks.ts` (novo)

---

## 📦 Commit 13: Configuração do Vitest

**Tipo:** `test`  
**Escopo:** `config`

```bash
git add vitest.config.ts
git commit -m "test(config): atualizar configuração do Vitest

- Configurar thresholds de 80% de cobertura
- Adicionar setupFiles e globalSetup
- Configurar coverage adequadamente"
```

**Arquivos:**
- `vitest.config.ts` (modificado)

---

## 📦 Commit 14: Documentação

**Tipo:** `docs`  
**Escopo:** `docs`

```bash
git add docs/roadmap-refatoracao-completo.md
git commit -m "docs: adicionar roadmap completo de refatoração

- Documentar todas as fases de refatoração
- Incluir justificativas e impactos
- Servir como guia para evolução do projeto"
```

**Arquivos:**
- `docs/roadmap-refatoracao-completo.md` (novo)

---

## 📦 Commit 15: Dependências (se houver mudanças)

**Tipo:** `chore`  
**Escopo:** `deps`

```bash
git add package.json
git commit -m "chore(deps): atualizar dependências se necessário

- Verificar se há mudanças em package.json
- Se não houver, pular este commit"
```

**Arquivos:**
- `package.json` (modificado, se houver mudanças)

---

## 📋 Resumo da Sequência

1. **Estrutura base** - Interfaces e tipos compartilhados
2. **Infraestrutura** - Logger adapter e Token service
3. **Circuit Breaker** - Desacoplamento
4. **Cache Service** - Refatoração com interfaces
5. **Repositories** - Implementação de interfaces
6. **Services** - Conversão para classes com DI
7. **DI Container** - Service factory
8. **Rotas** - Atualização para usar DI
9. **Configurações** - Uso de constantes
10. **Testes Setup** - Infraestrutura básica
11. **Testes Factories** - Helpers e fixtures
12. **Testes Mocks** - Mocks para interfaces
13. **Vitest Config** - Configuração de testes
14. **Documentação** - Roadmap
15. **Dependências** - Se necessário

---

## 🎯 Ordem Lógica

A ordem segue o princípio de **dependências**: primeiro criamos as bases (interfaces), depois implementamos (infra), depois refatoramos (services/repositories), depois integramos (DI), depois testamos (testes), e por fim documentamos.

Cada commit é **coeso** e **testável** isoladamente.

