# 📊 Status Fase 11 e Próximos Passos - API Solid

**Data de Criação:** Janeiro 2025  
**Última Atualização:** Janeiro 2025  
**Status Atual:** Fase 11 Completa ✅ | Próximas Fases: 12, 13, 14

---

## 📋 Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Fase 11 - O Que Foi Feito](#fase-11---o-que-foi-feito)
3. [Problemas Identificados](#problemas-identificados)
4. [Próximas Fases Detalhadas](#próximas-fases-detalhadas)
5. [Funcionalidades Pendentes](#funcionalidades-pendentes)
6. [Roadmap Completo](#roadmap-completo)

---

## 1. Resumo Executivo

### ✅ Status Atual

**Fase 11: COMPLETA** ✅

- **Cobertura de Testes:** 95.98% statements | 81.7% branches | 96.05% functions | 95.93% lines
- **Total de Testes:** 107 testes passando
- **Módulos com 100% de Cobertura:** auth, users, monitoring
- **Módulos com Alta Cobertura:** health (100% statements, 83.33% branches)

### ⚠️ Problemas Identificados

- **Erros TypeScript:** 7 erros encontrados
- **Warnings Linter:** 12 warnings encontrados
- **Problemas Principais:**
  - Erros de tipo em testes unitários (mocks incorretos)
  - Erros de tipo no error-handler.ts
  - Imports não utilizados
  - Uso de `any` em alguns testes

### 🎯 Próximas Fases

1. **Fase 12:** Otimizações e Performance (1-2 semanas)
2. **Fase 13:** Developer Experience (DX) (2-3 semanas)
3. **Fase 14:** Observabilidade Avançada (2-3 semanas)

---

## 2. Fase 11 - O Que Foi Feito

### 2.1 Testes Implementados

#### ✅ Testes de Integração - Health Routes
**Arquivo:** `src/modules/health/__tests__/integration/health.routes.test.ts`
- **Total:** 7 testes
- **Cobertura:** 100% statements, 50% branches (linha 20 - branch 503 não testado)
- **Cenários Cobertos:**
  - ✅ Retorno 200 com status healthy quando serviços estão up
  - ✅ Validação de timestamp ISO válido
  - ✅ Validação de uptime válido
  - ✅ ResponseTime em checks quando serviços estão up
  - ✅ Validação de schema de resposta
  - ✅ Preparação para retorno 503 (teste genérico)

#### ✅ Testes Unitários - Health Service
**Arquivo:** `src/modules/health/__tests__/unit/health.service.test.ts`
- **Total:** 7 testes
- **Cobertura:** 100% statements, 100% branches, 100% functions
- **Cenários Cobertos:**
  - ✅ Status healthy quando database e redis estão up
  - ✅ Status unhealthy quando database está down
  - ✅ Status unhealthy quando redis está down
  - ✅ Status unhealthy quando ambos estão down
  - ✅ ResponseTime incluído quando serviços estão up
  - ✅ Timestamp ISO válido
  - ✅ Uptime válido

#### ✅ Testes de Integração - Monitoring Routes
**Arquivo:** `src/modules/monitoring/__tests__/integration/monitoring.routes.test.ts`
- **Total:** 6 testes
- **Cobertura:** 100% statements, 100% branches, 100% functions
- **Cenários Cobertos:**
  - ✅ Retorno 200 com métricas
  - ✅ Timestamp ISO válido
  - ✅ Métricas para rotas acessadas
  - ✅ Estrutura correta de métricas por rota
  - ✅ Validação de schema
  - ✅ Rastreamento de múltiplas rotas

#### ✅ Testes Unitários - Monitoring Service
**Arquivo:** `src/modules/monitoring/__tests__/unit/monitoring.service.test.ts`
- **Total:** 9 testes
- **Cobertura:** 100% statements, 100% branches, 100% functions
- **Cenários Cobertos:**
  - ✅ Retorno de métricas com timestamp e routes
  - ✅ Timestamp ISO válido
  - ✅ Routes vazio quando não há métricas
  - ✅ Formatação correta de métricas de rotas
  - ✅ Cálculo de tempo médio de resposta
  - ✅ Cálculo de taxa de erro
  - ✅ LastRequestTime quando disponível
  - ✅ Múltiplas rotas independentes

#### ✅ Testes E2E - Auth Flow
**Arquivo:** `src/__tests__/e2e/auth-flow.test.ts`
- **Total:** 5 testes
- **Cenários Cobertos:**
  - ✅ Fluxo completo: register → login → access protected route
  - ✅ Falha ao acessar rota protegida sem token
  - ✅ Falha ao acessar rota protegida com token inválido
  - ✅ Acesso a rotas públicas sem autenticação
  - ✅ Register e retrieve profile

#### ✅ Testes Unitários - Logger Adapter
**Arquivo:** `src/infra/logger/__tests__/unit/fastify-logger-adapter.test.ts`
- **Total:** 10 testes
- **Cobertura:** 100% statements, 100% branches, 100% functions
- **Cenários Cobertos:**
  - ✅ info() com string e object
  - ✅ warn() com string e object
  - ✅ error() com string e object
  - ✅ fatal() com message
  - ✅ debug() com string e object quando debug existe
  - ✅ debug() não lança erro quando debug não existe

#### ✅ Testes Unitários - JWT Token Service
**Arquivo:** `src/infra/auth/__tests__/unit/jwt-token-service.test.ts`
- **Total:** 4 testes
- **Cobertura:** 100% statements, 100% branches, 100% functions
- **Cenários Cobertos:**
  - ✅ sign() com payload USER
  - ✅ sign() com payload ADMIN
  - ✅ verify() com token válido
  - ✅ verify() lança erro com token inválido

#### ✅ Testes Unitários - Authorize Middleware
**Arquivo:** `src/http/middlewares/__tests__/unit/authorize.test.ts`
- **Total:** 4 testes
- **Cobertura:** 100% statements, 50% branches (precisa mais casos)
- **Cenários Cobertos:**
  - ✅ Permite acesso quando user tem role requerida
  - ✅ Permite acesso quando user tem uma das múltiplas roles permitidas
  - ✅ Lança ForbiddenError quando user não tem role requerida
  - ✅ Lança ForbiddenError quando role não está na lista permitida

### 2.2 Infraestrutura de Testes

#### ✅ Configuração Vitest
- **Arquivo:** `vitest.config.ts`
- **Melhorias:**
  - ✅ Configurado `fileParallelism: false` para evitar race conditions
  - ✅ Timeout aumentado para 10s (testes de I/O)
  - ✅ Coverage thresholds configurados (80%)
  - ✅ Removido `poolOptions` deprecado (Vitest 4)

#### ✅ Helpers de Teste
- **Arquivo:** `src/__tests__/helpers/test-helpers.ts`
- **Melhorias:**
  - ✅ `buildTestApp()` refatorado para criar instância isolada do Fastify
  - ✅ `generateTestToken()` criado para facilitar testes de autenticação
  - ✅ Isolamento completo entre testes

#### ✅ Factories de Repository
- **Arquivos:** `src/modules/users/users.repository.ts`, `src/modules/auth/auth.repository.ts`
- **Melhorias:**
  - ✅ `createUsersRepository(prismaClient)` criada
  - ✅ `createAuthRepository(prismaClient)` criada
  - ✅ Permite usar `testPrisma` em testes, garantindo isolamento

### 2.3 Estatísticas Finais

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Total de Testes** | 56 | 107 | +91 testes (+162%) |
| **Cobertura Statements** | 73.17% | 95.98% | +22.81% |
| **Cobertura Branches** | 54.87% | 81.7% | +26.83% |
| **Cobertura Functions** | 71.05% | 96.05% | +25% |
| **Cobertura Lines** | 73.49% | 95.93% | +22.44% |

---

## 3. Problemas Identificados

### 3.1 Erros TypeScript

#### 🔴 Erro 1: `src/http/error-handler.ts` - Linhas 34, 35, 61, 68

**Problema:**
```typescript
// Linha 34-35
if ('validation' in error) {
  const validationErrors = error.validation;
  // ...
}

// Linha 61
request.log.error(error);

// Linha 68
message: error.message,
```

**Causa:**
- TypeScript não consegue inferir que `error` pode ter propriedade `validation`
- `error` é tipado como `TError` genérico que não garante propriedades específicas
- `request.log.error()` espera tipos específicos do Fastify logger

**Impacto:**
- ⚠️ Médio - Código funciona em runtime, mas TypeScript não valida tipos corretamente
- ⚠️ Pode mascarar bugs em produção

**Alternativas de Correção:**

**Opção A: Type Guards (Recomendado)**
```typescript
// Criar type guards para validação
function isValidationError(error: unknown): error is { validation: unknown[] } {
  return typeof error === 'object' && error !== null && 'validation' in error;
}

// Usar no error-handler
if (isValidationError(error)) {
  const validationErrors = error.validation;
  // ...
}
```

**Opção B: Type Assertions (Menos Seguro)**
```typescript
// Usar type assertion quando necessário
if ('validation' in error) {
  const validationErrors = (error as { validation: unknown[] }).validation;
  // ...
}
```

**Opção C: Refatorar Error Handler**
- Criar classes de erro específicas para validação
- Usar discriminated unions para tipos de erro
- Mais trabalho, mas mais type-safe

**Recomendação:** Opção A (Type Guards) - Mantém type safety sem overengineering

---

#### 🔴 Erro 2: `src/infra/auth/__tests__/unit/jwt-token-service.test.ts` - Linhas 29, 47, 67

**Problema:**
```typescript
// Linha 29
vi.mocked(mockJwt.sign).mockReturnValue(expectedToken);

// Linha 47
vi.mocked(mockJwt.sign).mockReturnValue(expectedToken);

// Linha 67
vi.mocked(mockJwt.verify).mockReturnValue(expectedPayload);
```

**Causa:**
- `mockJwt.sign` e `mockJwt.verify` são mockados como `vi.fn()` que retorna `void` por padrão
- TypeScript infere o tipo de retorno como `void` em vez de `string` ou `JWTPayload`
- `mockReturnValue` espera o mesmo tipo que a função retorna

**Impacto:**
- ⚠️ Baixo - Testes funcionam em runtime, mas TypeScript reclama
- ⚠️ Pode causar confusão durante desenvolvimento

**Alternativas de Correção:**

**Opção A: Tipar o Mock Corretamente (Recomendado)**
```typescript
const mockJwt: FastifyInstance['jwt'] = {
  sign: vi.fn<[JWTPayload], string>(),
  verify: vi.fn<[string], JWTPayload>(),
} as unknown as FastifyInstance['jwt'];
```

**Opção B: Usar `mockResolvedValue` se fosse async**
```typescript
// Não aplicável aqui, pois sign/verify são síncronos
```

**Opção C: Type Assertion no Mock**
```typescript
vi.mocked(mockJwt.sign).mockReturnValue(expectedToken as string);
```

**Recomendação:** Opção A - Tipagem explícita do mock

---

#### 🔴 Erro 3: `src/modules/health/__tests__/unit/health.service.test.ts` - Linha 113

**Problema:**
```typescript
// Linha 113
vi.mocked(prisma.$queryRaw).mockImplementation(async () => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [{ '?column?': 1 }] as any;
});
```

**Causa:**
- `prisma.$queryRaw` retorna `PrismaPromise<unknown>`, não `Promise<any>`
- `mockImplementation` está retornando `Promise<any>` em vez de `PrismaPromise`
- TypeScript detecta incompatibilidade de tipos

**Impacto:**
- ⚠️ Baixo - Testes funcionam, mas TypeScript reclama
- ⚠️ Pode causar problemas se PrismaPromise tiver comportamento específico

**Alternativas de Correção:**

**Opção A: Usar `mockResolvedValue` (Recomendado)**
```typescript
vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
// E criar delay separadamente se necessário
```

**Opção B: Criar PrismaPromise Mock**
```typescript
// Criar helper que retorna PrismaPromise
function createMockPrismaPromise<T>(value: T): PrismaPromise<T> {
  return Promise.resolve(value) as PrismaPromise<T>;
}
```

**Opção C: Type Assertion Mais Específica**
```typescript
vi.mocked(prisma.$queryRaw).mockImplementation(async () => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return [{ '?column?': 1 }] as PrismaPromise<unknown>;
});
```

**Recomendação:** Opção A - Mais simples e direto

---

### 3.2 Warnings Linter

#### ⚠️ Warning 1: `src/__tests__/helpers/test-helpers.ts` - Linha 20

**Problema:**
```typescript
import { loggerConfig } from '@/infra/logger/logger';
```

**Causa:**
- Import não utilizado após refatoração do `buildTestApp()`
- `loggerConfig` foi removido quando mudamos para `logger: false` no Fastify

**Impacto:**
- ⚠️ Mínimo - Apenas código não utilizado

**Correção:**
```typescript
// Remover linha 20
// import { loggerConfig } from '@/infra/logger/logger';
```

---

#### ⚠️ Warning 2: `src/http/middlewares/__tests__/unit/authorize.test.ts` - Linha 20

**Problema:**
```typescript
const token = await generateTestToken(app, {
  sub: 'user-id',
  email: 'admin@example.com',
  role: 'ADMIN',
});
// token não é usado no teste
```

**Causa:**
- Variável criada mas não utilizada
- Provavelmente era para ser usada mas o teste foi simplificado

**Impacto:**
- ⚠️ Mínimo - Código não utilizado

**Correção:**
```typescript
// Opção 1: Remover a linha
// Opção 2: Usar _token para indicar que é intencionalmente não usado
const _token = await generateTestToken(app, { ... });
```

---

#### ⚠️ Warning 3: `src/modules/users/__tests__/integration/users.repository.test.ts` - Linha 6

**Problema:**
```typescript
import type { UserDTO } from '../../users.dto';
```

**Causa:**
- Import não utilizado no arquivo
- Provavelmente foi usado antes mas removido durante refatoração

**Impacto:**
- ⚠️ Mínimo - Apenas código não utilizado

**Correção:**
```typescript
// Remover linha 6 se realmente não for usado
```

---

#### ⚠️ Warning 4-9: `src/modules/health/__tests__/unit/health.service.test.ts` - Uso de `any`

**Problemas:**
- Linhas 40, 76, 115, 133, 148: Uso de `as any` em mocks

**Causa:**
- Mocks do Prisma e Redis precisam de type assertions
- TypeScript não consegue inferir tipos corretos dos mocks

**Impacto:**
- ⚠️ Médio - Perde type safety, mas necessário para mocks complexos

**Alternativas de Correção:**

**Opção A: Criar Tipos Específicos para Mocks**
```typescript
type MockPrisma = {
  $queryRaw: ReturnType<typeof vi.fn<[], PrismaPromise<unknown>>>;
};

type MockRedis = {
  ping: ReturnType<typeof vi.fn<[], Promise<string>>>;
};
```

**Opção B: Usar `unknown` e Type Guards**
```typescript
const mockResult = [{ '?column?': 1 }] as unknown;
// Validar tipo antes de usar
```

**Opção C: Manter `as any` com comentário explicativo**
```typescript
// Mock do Prisma - necessário usar 'as any' devido à complexidade do tipo PrismaPromise
vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
```

**Recomendação:** Opção C - Pragmático, com documentação

---

### 3.3 Resumo de Problemas

| Tipo | Quantidade | Severidade | Prioridade |
|------|------------|------------|------------|
| **Erros TypeScript** | 7 | Média | Alta |
| **Warnings Linter** | 12 | Baixa | Média |
| **Imports Não Utilizados** | 3 | Mínima | Baixa |
| **Uso de `any`** | 6 | Média | Média |

**Total de Problemas:** 28

---

## 4. Próximas Fases Detalhadas

### 🔴 FASE 12: Otimizações e Performance

**Duração Estimada:** 1-2 semanas  
**Prioridade:** Alta  
**Dependências:** Fase 11 completa

#### 4.1 Objetivo

Otimizar performance da aplicação, queries do banco de dados, estratégias de cache e identificar e resolver bottlenecks.

#### 4.2 Por Que Agora?

1. **Base Sólida Estabelecida**
   - Testes garantem que otimizações não quebram funcionalidades
   - Cobertura alta permite refatorações seguras
   - Arquitetura desacoplada facilita otimizações pontuais

2. **Performance é Crítico**
   - Aplicação precisa escalar
   - Queries lentas podem degradar experiência
   - Cache mal configurado desperdiça recursos

3. **Preparação para Produção**
   - Otimizações devem ser feitas antes de escalar
   - Melhor identificar problemas cedo
   - Performance é parte da qualidade

#### 4.3 Tarefas Detalhadas

##### Tarefa 12.1: Análise de Performance

**O que fazer:**
- Profiling da aplicação
- Identificar endpoints lentos
- Analisar queries do Prisma
- Verificar uso de cache

**Ferramentas:**
- `clinic.js` ou `0x` para profiling Node.js
- `prisma-query-log` para analisar queries
- Métricas do Fastify (já implementadas)
- APM tools (opcional)

**Entregáveis:**
- Relatório de bottlenecks identificados
- Lista de queries lentas
- Análise de uso de cache

**Duração:** 2-3 dias

---

##### Tarefa 12.2: Otimização de Queries Prisma

**O que fazer:**

1. **Adicionar Índices no Banco**
   ```prisma
   // prisma/schema.prisma
   model User {
     email String @unique
     // Adicionar índices para queries frequentes
     @@index([email])
     @@index([role, created_at])
   }
   ```

2. **Otimizar Queries Existentes**
   - Revisar `usersRepository.findAll()` - verificar se precisa de índices
   - Revisar `usersRepository.findByEmail()` - já tem índice único
   - Adicionar `select` específico onde necessário (já feito)
   - Evitar N+1 queries

3. **Usar Prisma Query Optimization**
   - `findMany` com `select` específico (já implementado)
   - Paginação eficiente (já implementado)
   - Evitar `include` desnecessário

**Arquivos a Modificar:**
- `prisma/schema.prisma` - Adicionar índices
- `src/modules/users/users.repository.ts` - Revisar queries
- `src/modules/auth/auth.repository.ts` - Revisar queries

**Entregáveis:**
- Índices adicionados no schema
- Queries otimizadas
- Testes de performance (opcional)

**Duração:** 2-3 dias

---

##### Tarefa 12.3: Otimização de Cache

**O que fazer:**

1. **Revisar Estratégias de Cache**
   - Verificar TTLs adequados
   - Invalidar cache quando necessário
   - Cache de queries frequentes

2. **Implementar Cache de Queries Pesadas**
   - Cache de contagem de usuários (se necessário)
   - Cache de health checks (opcional)
   - Cache de métricas (se necessário)

3. **Otimizar Invalidação**
   - Usar padrões de chave consistentes (já implementado)
   - Invalidar apenas o necessário
   - Evitar `invalidateByPattern` em loops

**Arquivos a Revisar:**
- `src/core/shared/constants.ts` - TTLs
- `src/modules/users/users.service.ts` - Estratégia de cache
- `src/infra/cache/cache-service.ts` - Implementação

**Entregáveis:**
- TTLs otimizados
- Estratégia de cache documentada
- Cache de queries pesadas implementado

**Duração:** 2-3 dias

---

##### Tarefa 12.4: Otimização de Serialização

**O que fazer:**

1. **Revisar Serializers**
   - Verificar se transformações são eficientes
   - Evitar transformações desnecessárias
   - Usar serialização nativa quando possível

2. **Otimizar Respostas HTTP**
   - Reduzir tamanho de payloads
   - Usar compressão (gzip/brotli) - Fastify já suporta
   - Evitar dados desnecessários

**Arquivos a Revisar:**
- `src/modules/users/users.serializers.ts`
- `src/config/app.ts` - Configurar compressão

**Entregáveis:**
- Serializers otimizados
- Compressão configurada
- Payloads reduzidos

**Duração:** 1-2 dias

---

##### Tarefa 12.5: Performance Testing

**O que fazer:**

1. **Criar Testes de Performance**
   - Load testing com `autocannon` ou `k6`
   - Testes de stress
   - Benchmarks de endpoints críticos

2. **Configurar Métricas de Performance**
   - Response time por endpoint
   - Throughput
   - Error rate sob carga

**Ferramentas:**
- `autocannon` para load testing
- `k6` para testes mais avançados
- Métricas do Fastify (já implementadas)

**Entregáveis:**
- Scripts de load testing
- Relatório de performance
- Benchmarks estabelecidos

**Duração:** 2-3 dias

---

#### 4.4 Resultado Esperado

- ✅ Queries otimizadas (índices adicionados)
- ✅ Cache estratégico implementado
- ✅ Performance melhorada (métricas)
- ✅ Load testing configurado
- ✅ Documentação de otimizações

#### 4.5 Validação

- [ ] Queries executam < 100ms (média)
- [ ] Cache hit rate > 70%
- [ ] Response time p95 < 200ms
- [ ] Throughput > 1000 req/s (depende do hardware)
- [ ] Zero regressões (todos testes passando)

---

### 🟡 FASE 13: Developer Experience (DX)

**Duração Estimada:** 2-3 semanas  
**Prioridade:** Média  
**Dependências:** Fases 1-12 completas

#### 4.6 Objetivo

Melhorar experiência de desenvolvimento, facilitar criação de novos módulos, documentar padrões e criar ferramentas que acelerem desenvolvimento.

#### 4.7 Por Que Agora?

1. **Padrões Estabelecidos**
   - Arquitetura consolidada
   - Padrões claros e testados
   - Base sólida para automatizar

2. **Facilita Escalabilidade**
   - Novos desenvolvedores onboardam mais rápido
   - Criação de módulos é mais rápida
   - Menos erros por seguir padrões

3. **Investimento em Produtividade**
   - Tempo economizado compensa tempo investido
   - Código mais consistente
   - Menos retrabalho

#### 4.8 Tarefas Detalhadas

##### Tarefa 13.1: Generator de Módulos

**O que fazer:**

Criar CLI tool que gera estrutura completa de módulo seguindo padrões estabelecidos.

**Estrutura Gerada:**
```
src/modules/{module-name}/
├── {module}.routes.ts
├── {module}.service.ts
├── {module}.repository.ts
├── {module}.schemas.ts
├── {module}.dto.ts
├── {module}.serializers.ts (opcional)
└── __tests__/
    ├── unit/
    │   └── {module}.service.test.ts
    └── integration/
        ├── {module}.repository.test.ts
        └── {module}.routes.test.ts
```

**Implementação:**

1. **Criar `scripts/generate-module.ts`**
   ```typescript
   // Usar templates ou programaticamente criar arquivos
   // Seguir estrutura padrão
   // Incluir imports corretos
   // Adicionar testes básicos
   ```

2. **Templates para Arquivos**
   - Template de routes
   - Template de service
   - Template de repository
   - Template de schemas
   - Template de testes

3. **Script NPM**
   ```json
   {
     "scripts": {
       "generate:module": "tsx scripts/generate-module.ts"
     }
   }
   ```

**Ferramentas:**
- `plop` ou `yeoman` para generators
- Ou criar script customizado com `fs` e templates

**Entregáveis:**
- CLI tool funcional
- Templates para todos os arquivos
- Documentação de uso
- Exemplos

**Duração:** 3-4 dias

---

##### Tarefa 13.2: Documentação de Desenvolvimento

**O que fazer:**

1. **Guia de Desenvolvimento**
   - Como criar novo módulo
   - Padrões a seguir
   - Convenções de código
   - Estrutura de pastas

2. **Architecture Decision Records (ADRs)**
   - Documentar decisões importantes
   - Por que certas escolhas foram feitas
   - Alternativas consideradas

3. **Exemplos Práticos**
   - Exemplo completo de módulo
   - Exemplos de testes
   - Exemplos de uso de DI

**Estrutura de Documentação:**
```
docs/
├── development/
│   ├── getting-started.md
│   ├── creating-modules.md
│   ├── testing-guide.md
│   └── patterns.md
├── architecture/
│   ├── decisions/
│   │   ├── 001-dependency-injection.md
│   │   ├── 002-repository-pattern.md
│   │   └── ...
│   └── overview.md
└── examples/
    ├── complete-module-example.md
    └── testing-examples.md
```

**Entregáveis:**
- Guias completos de desenvolvimento
- ADRs documentados
- Exemplos práticos
- README atualizado

**Duração:** 3-4 dias

---

##### Tarefa 13.3: Scripts e Helpers de Desenvolvimento

**O que fazer:**

1. **Scripts Úteis**
   - `pnpm db:reset` - Reset completo do banco
   - `pnpm db:seed:test` - Seed de dados de teste
   - `pnpm test:watch:module` - Watch mode para módulo específico
   - `pnpm lint:fix:all` - Fix automático de lint

2. **Helpers de Desenvolvimento**
   - Funções utilitárias para desenvolvimento
   - Debug helpers
   - Test helpers adicionais

**Scripts a Criar:**
```json
{
  "scripts": {
    "db:reset": "prisma migrate reset --force",
    "db:seed:test": "tsx scripts/seed-test-data.ts",
    "test:watch:module": "vitest watch --grep",
    "dev:debug": "node --inspect-brk -r tsx src/server.ts"
  }
}
```

**Entregáveis:**
- Scripts úteis criados
- Helpers de desenvolvimento
- Documentação de scripts

**Duração:** 2-3 dias

---

##### Tarefa 13.4: Templates e Exemplos

**O que fazer:**

1. **Templates de Código**
   - Template de service completo
   - Template de repository completo
   - Template de routes completo
   - Template de testes completo

2. **Exemplos Completos**
   - Módulo exemplo completo (ex: `modules/example`)
   - Mostrar todos os padrões
   - Comentários explicativos

**Estrutura:**
```
docs/templates/
├── service.template.ts
├── repository.template.ts
├── routes.template.ts
└── test.template.ts

examples/
└── example-module/
    └── (estrutura completa)
```

**Entregáveis:**
- Templates criados
- Módulo exemplo completo
- Documentação de templates

**Duração:** 2-3 dias

---

##### Tarefa 13.5: Melhorias de Workflow

**O que fazer:**

1. **Pre-commit Hooks Melhorados**
   - Validar testes antes de commit
   - Validar coverage mínimo
   - Validar tipos

2. **CI/CD Melhorado**
   - Pipeline mais rápido
   - Cache de dependências
   - Testes paralelos quando possível

3. **VS Code Snippets**
   - Snippets para criar módulos
   - Snippets para testes
   - Snippets para services

**Entregáveis:**
- Hooks melhorados
- CI/CD otimizado
- Snippets configurados

**Duração:** 2-3 dias

---

#### 4.9 Resultado Esperado

- ✅ Generator de módulos funcional
- ✅ Documentação completa
- ✅ Scripts úteis criados
- ✅ Templates e exemplos disponíveis
- ✅ Workflow otimizado

#### 4.10 Validação

- [ ] Generator cria módulo completo em < 2 minutos
- [ ] Documentação cobre todos os aspectos
- [ ] Novos desenvolvedores conseguem criar módulo seguindo docs
- [ ] Scripts facilitam desenvolvimento diário
- [ ] Exemplos são claros e úteis

---

### 🟢 FASE 14: Observabilidade Avançada

**Duração Estimada:** 2-3 semanas  
**Prioridade:** Baixa (mas importante para produção)  
**Dependências:** Fases 1-13 completas

#### 4.11 Objetivo

Implementar observabilidade completa: métricas avançadas, distributed tracing, correlation IDs, alertas e monitoramento proativo.

#### 4.12 Por Que Agora?

1. **Base Pronta**
   - Métricas básicas já implementadas
   - Health checks funcionando
   - Estrutura permite extensão

2. **Necessário para Produção**
   - Debugging em produção
   - Monitoramento de performance
   - Alertas proativos

3. **Facilita Manutenção**
   - Identificar problemas rapidamente
   - Análise de performance
   - Troubleshooting facilitado

#### 4.13 Tarefas Detalhadas

##### Tarefa 14.1: Correlation IDs

**O que fazer:**

1. **Implementar Correlation ID Middleware**
   - Gerar ID único por request
   - Incluir em todos os logs
   - Retornar no header de resposta

2. **Integrar com Logger**
   - Logger automaticamente inclui correlation ID
   - Facilita rastreamento de requests

**Implementação:**
```typescript
// src/http/middlewares/correlation-id.ts
export async function correlationId(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const correlationId = request.headers['x-correlation-id'] || generateUUID();
  request.correlationId = correlationId;
  reply.header('X-Correlation-ID', correlationId);
}
```

**Entregáveis:**
- Middleware de correlation ID
- Logger integrado
- Headers configurados

**Duração:** 1-2 dias

---

##### Tarefa 14.2: Métricas Avançadas

**O que fazer:**

1. **Integração com Prometheus**
   - Expor métricas no formato Prometheus
   - Endpoint `/metrics` compatível
   - Métricas de negócio

2. **Métricas Adicionais**
   - Métricas de cache (hit/miss rate)
   - Métricas de banco (query time, connections)
   - Métricas de autenticação (login attempts, failures)

**Implementação:**
```typescript
// src/infra/monitoring/prometheus.ts
// Expor métricas no formato Prometheus
// Integrar com metricsCollector existente
```

**Ferramentas:**
- `prom-client` para métricas Prometheus
- Grafana para visualização (opcional)

**Entregáveis:**
- Endpoint `/metrics` compatível com Prometheus
- Métricas de negócio implementadas
- Documentação de métricas

**Duração:** 3-4 dias

---

##### Tarefa 14.3: Distributed Tracing

**O que fazer:**

1. **Implementar Tracing Básico**
   - Spans para operações importantes
   - Trace context propagation
   - Integração com logger

2. **Integração com OpenTelemetry (Opcional)**
   - Se necessário para produção
   - Export para Jaeger/Zipkin

**Implementação:**
```typescript
// src/core/tracing/tracer.ts
// Criar spans para operações
// Propagar trace context
```

**Ferramentas:**
- OpenTelemetry (se necessário)
- Jaeger ou Zipkin (opcional)

**Entregáveis:**
- Tracing básico implementado
- Spans para operações críticas
- Documentação de tracing

**Duração:** 3-4 dias

---

##### Tarefa 14.4: Alertas e Monitoramento

**O que fazer:**

1. **Health Checks Avançados**
   - Verificar dependências críticas
   - Alertar quando serviços estão down
   - Health check com mais detalhes

2. **Alertas Configuráveis**
   - Alertas para erros altos
   - Alertas para performance degradada
   - Alertas para uso de recursos

**Implementação:**
```typescript
// src/infra/monitoring/alerts.ts
// Sistema de alertas básico
// Integração com health checks
```

**Ferramentas:**
- Webhooks para alertas
- Integração com serviços externos (opcional)

**Entregáveis:**
- Health checks avançados
- Sistema de alertas básico
- Configuração de alertas

**Duração:** 2-3 dias

---

##### Tarefa 14.5: Logging Estruturado Avançado

**O que fazer:**

1. **Melhorar Logs**
   - Logs estruturados consistentes
   - Níveis de log apropriados
   - Contexto rico nos logs

2. **Log Aggregation (Opcional)**
   - Preparar para ELK stack ou similar
   - Formato de logs compatível

**Entregáveis:**
- Logs estruturados melhorados
- Formato compatível com aggregation
- Documentação de logging

**Duração:** 2-3 dias

---

#### 4.14 Resultado Esperado

- ✅ Correlation IDs implementados
- ✅ Métricas Prometheus expostas
- ✅ Tracing básico funcionando
- ✅ Alertas configurados
- ✅ Logs estruturados melhorados

#### 4.15 Validação

- [ ] Correlation IDs em todos os requests
- [ ] Métricas expostas corretamente
- [ ] Tracing funciona para operações críticas
- [ ] Alertas disparam quando necessário
- [ ] Logs são estruturados e úteis

---

## 5. Funcionalidades Pendentes

### 5.1 Funcionalidades do Domínio GymPass

Baseado no schema Prisma e estrutura atual, as seguintes funcionalidades parecem estar planejadas mas não implementadas:

#### 🔴 Módulo de Gyms (Academias)

**Status:** Não implementado

**O que falta:**
- `gyms.routes.ts` - Rotas para gerenciar academias
- `gyms.service.ts` - Lógica de negócio
- `gyms.repository.ts` - Acesso a dados
- `gyms.schemas.ts` - Validação
- Testes completos

**Endpoints Esperados:**
- `GET /gyms` - Listar academias (com filtro de proximidade?)
- `GET /gyms/:id` - Detalhes de academia
- `POST /gyms` - Criar academia (ADMIN)
- `PUT /gyms/:id` - Atualizar academia (ADMIN)
- `DELETE /gyms/:id` - Deletar academia (ADMIN)

**Complexidade:** Média  
**Prioridade:** Alta (funcionalidade core do domínio)

---

#### 🔴 Módulo de Check-ins

**Status:** Não implementado

**O que falta:**
- `checkins.routes.ts` - Rotas para check-ins
- `checkins.service.ts` - Lógica de negócio
- `checkins.repository.ts` - Acesso a dados
- `checkins.schemas.ts` - Validação
- Testes completos

**Endpoints Esperados:**
- `POST /checkins` - Criar check-in (USER)
- `GET /checkins` - Listar check-ins do usuário
- `GET /checkins/:id` - Detalhes do check-in
- `PUT /checkins/:id/validate` - Validar check-in (ADMIN)

**Regras de Negócio Esperadas:**
- Usuário só pode fazer 1 check-in por dia na mesma academia
- Check-in precisa ser validado por ADMIN
- Verificar se usuário está próximo da academia (geolocalização?)

**Complexidade:** Alta  
**Prioridade:** Alta (funcionalidade core do domínio)

---

#### 🟡 Funcionalidades Adicionais de Usuários

**Status:** Parcialmente implementado

**O que falta:**
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário (soft delete?)
- `GET /users/:id` - Detalhes de usuário específico
- Upload de avatar (se necessário)
- Reset de senha
- Atualização de perfil

**Complexidade:** Baixa-Média  
**Prioridade:** Média

---

#### 🟡 Funcionalidades de Autenticação Adicionais

**Status:** Básico implementado

**O que falta:**
- Refresh tokens
- Logout (invalidar tokens)
- Reset de senha
- Verificação de email
- 2FA (Two-Factor Authentication) - opcional

**Complexidade:** Média-Alta  
**Prioridade:** Média-Alta (segurança)

---

### 5.2 Funcionalidades Técnicas Pendentes

#### 🟡 Validação de Geolocalização

**Status:** Não implementado

**O que fazer:**
- Validar proximidade para check-ins
- Calcular distância entre coordenadas
- Filtrar academias por proximidade

**Complexidade:** Média  
**Prioridade:** Média (depende do domínio)

---

#### 🟡 Upload de Arquivos

**Status:** Não implementado

**O que fazer:**
- Upload de avatares
- Upload de documentos (se necessário)
- Storage configurável (local/S3)

**Complexidade:** Média  
**Prioridade:** Baixa (depende de requisitos)

---

#### 🟡 Notificações

**Status:** Não implementado

**O que fazer:**
- Sistema de notificações
- Email notifications
- Push notifications (opcional)

**Complexidade:** Alta  
**Prioridade:** Baixa (nice to have)

---

## 6. Roadmap Completo

### 6.1 Fases Concluídas ✅

- ✅ **Fase 1:** Desacoplar Circuit Breaker
- ✅ **Fase 2:** Criar Estrutura de Interfaces Base
- ✅ **Fase 3:** Refatorar Cache Service
- ✅ **Fase 4:** Criar TokenService e Desacoplar Auth
- ✅ **Fase 5:** Converter Services para Classes com DI
- ✅ **Fase 6:** Extrair Magic Numbers para Constantes
- ✅ **Fase 7:** Criar DI Container Simples
- ✅ **Fase 8:** Criar Interfaces para Repositories
- ✅ **Fase 9:** Configurar Infraestrutura de Testes
- ✅ **Fase 10:** Implementar Testes Abrangentes (parcial)
- ✅ **Fase 11:** Aumentar Cobertura para 80%+ ✅ **COMPLETA**

### 6.2 Fases Pendentes

#### 🔴 Fase 12: Otimizações e Performance (1-2 semanas)
- Análise de performance
- Otimização de queries Prisma
- Otimização de cache
- Otimização de serialização
- Performance testing

#### 🟡 Fase 13: Developer Experience (2-3 semanas)
- Generator de módulos
- Documentação de desenvolvimento
- Scripts e helpers
- Templates e exemplos
- Melhorias de workflow

#### 🟢 Fase 14: Observabilidade Avançada (2-3 semanas)
- Correlation IDs
- Métricas Prometheus
- Distributed tracing
- Alertas e monitoramento
- Logging estruturado avançado

### 6.3 Funcionalidades Pendentes

#### 🔴 Críticas (Domínio)
- Módulo de Gyms (Academias)
- Módulo de Check-ins
- Validação de geolocalização

#### 🟡 Importantes (Melhorias)
- CRUD completo de usuários
- Refresh tokens
- Reset de senha
- Upload de arquivos

#### 🟢 Opcionais (Nice to Have)
- Notificações
- 2FA
- Verificação de email

---

## 7. Checklist de Correções Imediatas

### 7.1 Erros TypeScript (Prioridade Alta)

- [ ] **Erro 1:** Corrigir `error-handler.ts` - Usar type guards
- [ ] **Erro 2:** Corrigir `jwt-token-service.test.ts` - Tipar mocks corretamente
- [ ] **Erro 3:** Corrigir `health.service.test.ts` - Usar `mockResolvedValue`

### 7.2 Warnings Linter (Prioridade Média)

- [ ] **Warning 1:** Remover import não utilizado em `test-helpers.ts`
- [ ] **Warning 2:** Remover variável não utilizada em `authorize.test.ts`
- [ ] **Warning 3:** Remover import não utilizado em `users.repository.test.ts`
- [ ] **Warnings 4-9:** Documentar uso de `any` em testes ou criar tipos específicos

### 7.3 Melhorias de Código (Prioridade Baixa)

- [ ] Adicionar testes para branch 503 em `health.routes.test.ts`
- [ ] Adicionar mais casos de teste para `authorize.test.ts` (branches)
- [ ] Revisar e otimizar mocks em testes unitários

---

## 8. Conclusão

### 8.1 Status Atual

**Fase 11 está COMPLETA** ✅

- Cobertura de testes acima de 80% em todas as métricas
- 107 testes passando
- Infraestrutura de testes sólida
- Testes E2E implementados

### 8.2 Próximos Passos Recomendados

1. **Imediato:** Corrigir erros TypeScript e warnings
2. **Curto Prazo:** Fase 12 - Otimizações e Performance
3. **Médio Prazo:** Fase 13 - Developer Experience
4. **Longo Prazo:** Fase 14 - Observabilidade Avançada

### 8.3 Funcionalidades

- **Críticas:** Implementar módulos de Gyms e Check-ins
- **Importantes:** Completar CRUD de usuários e autenticação
- **Opcionais:** Funcionalidades avançadas quando necessário

---

**Documento criado em:** Janeiro 2025  
**Próxima revisão:** Após correção dos erros identificados

