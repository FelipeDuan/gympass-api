# Guia de Planejamento - Melhorias e Correções

**Versão:** 1.0.0  
**Data de Criação:** Janeiro 2025  
**Objetivo:** Transformar a aplicação em um projeto maduro, robusto e pronto para produção

---

## 📋 Índice

1. [Visão Geral do Planejamento](#visão-geral-do-planejamento)
2. [Metodologia e Princípios](#metodologia-e-princípios)
3. [Fase 0: Preparação e Setup Inicial](#fase-0-preparação-e-setup-inicial)
4. [Fase 1: Segurança Crítica - Autenticação e Autorização](#fase-1-segurança-crítica---autenticação-e-autorização)
5. [Fase 2: Segurança Crítica - Headers e Configurações](#fase-2-segurança-crítica---headers-e-configurações)
6. [Fase 3: Schema e Banco de Dados](#fase-3-schema-e-banco-de-dados)
7. [Fase 4: Testes - Configuração e Base](#fase-4-testes---configuração-e-base)
8. [Fase 5: Testes - Implementação](#fase-5-testes---implementação)
9. [Fase 6: Observabilidade](#fase-6-observabilidade)
10. [Fase 7: Performance](#fase-7-performance)
11. [Fase 8: Refatoração e Arquitetura](#fase-8-refatoração-e-arquitetura)
12. [Fase 9: Documentação](#fase-9-documentação)
13. [Checklist de Validação](#checklist-de-validação)
14. [Riscos e Mitigações](#riscos-e-mitigações)

---

## 1. Visão Geral do Planejamento

### 1.1 Objetivo Final

Transformar a aplicação atual em um projeto **maduro, robusto e pronto para produção**, seguindo as melhores práticas da indústria e garantindo:

- ✅ Segurança completa
- ✅ Testes abrangentes (80%+ coverage)
- ✅ Performance otimizada
- ✅ Observabilidade completa
- ✅ Código limpo e manutenível
- ✅ Documentação completa

### 1.2 Estratégia de Execução

**Abordagem:** Incremental e iterativa, priorizando itens críticos primeiro.

**Princípios:**
1. **Segurança primeiro:** Itens críticos de segurança antes de tudo
2. **Testes desde o início:** Configurar ambiente de testes antes de implementar features
3. **Validação contínua:** Testar cada mudança antes de prosseguir
4. **Documentação paralela:** Documentar enquanto implementa
5. **Refatoração gradual:** Melhorar código existente sem quebrar funcionalidades

### 1.3 Estimativa Total

- **Tempo Total:** 12-16 semanas (3-4 meses)
- **Esforço:** ~320-400 horas de desenvolvimento
- **Fases:** 9 fases principais + fase de preparação

### 1.4 Dependências Críticas

```
Fase 0 (Setup)
    ↓
Fase 1 (Auth) ──┐
    ↓            │
Fase 2 (Security)│
    ↓            │
Fase 3 (Schema) ─┤
    ↓            │
Fase 4 (Test Config) ──┐
    ↓                   │
Fase 5 (Tests) ────────┤
    ↓                   │
Fase 6 (Observability) ┤
    ↓                   │
Fase 7 (Performance) ───┤
    ↓                   │
Fase 8 (Refactoring) ───┤
    ↓                   │
Fase 9 (Documentation) ─┘
```

---

## 2. Metodologia e Princípios

### 2.1 Critérios de Sucesso por Fase

Cada fase deve atender aos seguintes critérios antes de prosseguir:

1. ✅ **Funcionalidade:** Tudo funciona como esperado
2. ✅ **Testes:** Cobertura adequada (quando aplicável)
3. ✅ **Documentação:** Mudanças documentadas
4. ✅ **Code Review:** Código revisado (auto-review ou peer)
5. ✅ **Validação:** Testes manuais e automatizados passando

### 2.2 Princípios de Desenvolvimento

1. **Test-Driven Development (TDD):** Quando possível, escrever testes antes do código
2. **Small Commits:** Commits pequenos e frequentes
3. **Feature Branches:** Uma branch por feature/melhoria
4. **Code Review:** Revisar código antes de merge
5. **Documentation as Code:** Documentar enquanto desenvolve

### 2.3 Ferramentas e Ambiente

**Ferramentas Necessárias:**
- Git (controle de versão)
- Node.js 22.x
- pnpm (gerenciador de pacotes)
- Docker & Docker Compose
- VS Code ou editor preferido
- Postman/Insomnia (testes manuais)

**Ambientes:**
- **Development:** Ambiente local com Docker
- **Testing:** Ambiente isolado para testes
- **Staging:** (Opcional) Ambiente de pré-produção

---

## 3. Fase 0: Preparação e Setup Inicial

**Duração Estimada:** 2-3 dias  
**Prioridade:** 🔴 Crítica  
**Dependências:** Nenhuma

### 3.1 Objetivo

Preparar o ambiente de desenvolvimento e configurar ferramentas essenciais antes de começar as melhorias.

### 3.2 Tarefas

#### Tarefa 0.1: Criar `.env.example`

**O que fazer:**
Criar arquivo `.env.example` com todas as variáveis de ambiente necessárias.

**Por quê:**
- Facilita onboarding de novos desenvolvedores
- Documenta variáveis necessárias
- Evita erros de configuração
- Boa prática de desenvolvimento

**Impacto:**
- ✅ Facilita setup do projeto
- ✅ Reduz erros de configuração
- ✅ Melhora experiência do desenvolvedor

**Passos:**

1. Criar arquivo `.env.example` na raiz do projeto:

```bash
touch .env.example
```

2. Adicionar conteúdo:

```env
# Ambiente
NODE_ENV=dev

# Servidor
PORT=3100

# Banco de Dados
DATABASE_URL=postgresql://docker:docker@localhost:5432/gympass

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT (será usado na Fase 1)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Logging (opcional)
LOG_LEVEL=info
```

3. Verificar que `.env` está no `.gitignore` (já deve estar)

4. Commit:
```bash
git add .env.example
git commit -m "docs: adiciona .env.example com variáveis de ambiente"
```

**Critérios de Sucesso:**
- ✅ Arquivo `.env.example` criado
- ✅ Todas as variáveis documentadas
- ✅ Valores de exemplo fornecidos
- ✅ Comentários explicativos

**Alternativas:**
- Usar `@fastify/env` com schema (mais complexo, mas mais robusto)
- Usar `dotenv-safe` (valida variáveis obrigatórias)

---

#### Tarefa 0.2: Configurar Scripts NPM

**O que fazer:**
Adicionar scripts úteis ao `package.json` para facilitar desenvolvimento.

**Por quê:**
- Facilita execução de tarefas comuns
- Padroniza comandos da equipe
- Melhora DX (Developer Experience)

**Impacto:**
- ✅ Comandos mais fáceis de lembrar
- ✅ Menos erros de digitação
- ✅ Workflow mais eficiente

**Passos:**

1. Abrir `package.json`

2. Adicionar scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src --out-dir build",
    "start": "node build/server.js",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:cov": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "prepare": "pnpm db:generate"
  }
}
```

3. Testar scripts:
```bash
pnpm lint
pnpm typecheck
pnpm test
```

4. Commit:
```bash
git add package.json
git commit -m "chore: adiciona scripts úteis ao package.json"
```

**Critérios de Sucesso:**
- ✅ Scripts adicionados e funcionando
- ✅ Documentação clara de cada script
- ✅ Scripts testados

---

#### Tarefa 0.3: Configurar Coverage no Vitest

**O que fazer:**
Configurar cobertura de testes no Vitest para medir qualidade do código.

**Por quê:**
- Permite medir cobertura de testes
- Identifica código não testado
- Ajuda a manter qualidade alta

**Impacto:**
- ✅ Visibilidade da cobertura de testes
- ✅ Identificação de gaps
- ✅ Métrica de qualidade

**Passos:**

1. Instalar dependência:
```bash
pnpm add -D @vitest/coverage-v8
```

2. Atualizar `vitest.config.ts`:

```typescript
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'build/',
        'generated/',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/test/**',
        'src/server.ts',
      ],
      thresholds: {
        lines: 0, // Aumentar gradualmente
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
});
```

3. Testar:
```bash
pnpm test:cov
```

4. Verificar pasta `coverage/` criada

5. Adicionar ao `.gitignore`:
```
coverage/
*.lcov
```

6. Commit:
```bash
git add vitest.config.ts .gitignore package.json pnpm-lock.yaml
git commit -m "chore: configura coverage no vitest"
```

**Critérios de Sucesso:**
- ✅ Coverage configurado
- ✅ Relatórios gerados corretamente
- ✅ Thresholds configurados (inicialmente em 0)

**Alternativas:**
- Usar `@vitest/coverage-istanbul` (mais antigo)
- Configurar thresholds mais altos desde o início (mais rigoroso)

---

#### Tarefa 0.4: Criar Estrutura de Pastas para Testes

**O que fazer:**
Criar estrutura de pastas organizada para testes.

**Por quê:**
- Organiza testes de forma clara
- Facilita manutenção
- Segue boas práticas

**Impacto:**
- ✅ Testes organizados
- ✅ Fácil de encontrar testes
- ✅ Escalável

**Passos:**

1. Criar estrutura:

```bash
mkdir -p src/__tests__/helpers
mkdir -p src/__tests__/fixtures
mkdir -p src/modules/users/__tests__/unit
mkdir -p src/modules/users/__tests__/integration
```

2. Criar arquivo helper para testes:

`src/__tests__/helpers/test-helpers.ts`:

```typescript
import { FastifyInstance } from 'fastify';
import { app } from '@/config/app';

export async function buildTestApp(): Promise<FastifyInstance> {
  // Configurações específicas para testes
  return app;
}

export function generateRandomEmail(): string {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomString(length = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}
```

3. Criar arquivo de fixtures:

`src/__tests__/fixtures/user.fixtures.ts`:

```typescript
import type { CreateUserSchema } from '@/modules/users/users.schemas';

export const createUserFixture = (
  overrides?: Partial<CreateUserSchema>,
): CreateUserSchema => ({
  name: 'John Doe',
  email: `john-${Math.random().toString(36).substring(7)}@example.com`,
  password: 'password123',
  ...overrides,
});
```

4. Commit:
```bash
git add src/__tests__
git commit -m "chore: cria estrutura de pastas para testes"
```

**Critérios de Sucesso:**
- ✅ Estrutura criada
- ✅ Helpers básicos criados
- ✅ Fixtures criados

---

#### Tarefa 0.5: Configurar Pre-commit Hooks (Opcional mas Recomendado)

**O que fazer:**
Configurar hooks do Git para executar lint e testes antes de commits.

**Por quê:**
- Previne código quebrado no repositório
- Mantém qualidade consistente
- Economiza tempo em code review

**Impacto:**
- ✅ Qualidade de código garantida
- ✅ Menos bugs em produção
- ✅ Code review mais eficiente

**Passos:**

1. Instalar dependências:
```bash
pnpm add -D husky lint-staged
```

2. Inicializar Husky:
```bash
pnpm exec husky init
```

3. Criar arquivo `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

4. Adicionar ao `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write",
      "biome format --write"
    ]
  }
}
```

5. Testar:
```bash
git add .
git commit -m "test: testa pre-commit hook"
```

6. Commit:
```bash
git add .husky package.json
git commit -m "chore: configura pre-commit hooks com husky"
```

**Critérios de Sucesso:**
- ✅ Hooks funcionando
- ✅ Lint executado antes de commit
- ✅ Commits bloqueados se houver erros

**Alternativas:**
- Usar `simple-git-hooks` (mais leve)
- Usar GitHub Actions para CI (mais complexo, mas mais robusto)

---

### 3.3 Validação da Fase 0

**Checklist:**
- [ ] `.env.example` criado e completo
- [ ] Scripts NPM configurados e testados
- [ ] Coverage configurado no Vitest
- [ ] Estrutura de testes criada
- [ ] Pre-commit hooks configurados (opcional)
- [ ] Todos os commits feitos
- [ ] Documentação atualizada

**Próxima Fase:** Fase 1 - Segurança Crítica (Autenticação)

---

## 4. Fase 1: Segurança Crítica - Autenticação e Autorização

**Duração Estimada:** 1-2 semanas  
**Prioridade:** 🔴 Crítica  
**Dependências:** Fase 0 completa

### 4.1 Objetivo

Implementar sistema completo de autenticação JWT e autorização baseada em roles, tornando a aplicação segura.

### 4.2 Contexto e Justificativa

**Por quê esta fase é crítica:**
- Sem autenticação, a aplicação está completamente insegura
- Requisito explícito do README não atendido
- Bloqueador absoluto para produção
- Base para todas as outras funcionalidades protegidas

**Impacto se não fizer:**
- ❌ Aplicação vulnerável a qualquer acesso não autorizado
- ❌ Impossível rastrear ações de usuários
- ❌ Dados sensíveis expostos
- ❌ Impossível implementar funcionalidades que requerem autenticação

**Impacto positivo:**
- ✅ Aplicação segura e protegida
- ✅ Base para implementar outras funcionalidades
- ✅ Conformidade com requisitos
- ✅ Pronto para produção (em termos de segurança básica)

---

### 4.3 Tarefas Detalhadas

#### Tarefa 1.1: Atualizar Schema Prisma - Adicionar Role

**O que fazer:**
Adicionar campo `role` ao modelo User e criar enum Role.

**Por quê:**
- Necessário para controle de acesso
- Requisito para funcionalidades admin
- Base para autorização

**Impacto:**
- ✅ Suporta diferentes níveis de acesso
- ✅ Permite implementar autorização
- ✅ Requer migration do banco

**Riscos:**
- ⚠️ Migration pode falhar se houver dados existentes
- ⚠️ Precisa definir valor padrão para usuários existentes

**Mitigação:**
- Usar valor padrão `USER` para usuários existentes
- Testar migration em ambiente de desenvolvimento primeiro

**Passos:**

1. Abrir `prisma/schema.prisma`

2. Adicionar enum Role antes do model User:

```prisma
enum Role {
  ADMIN
  USER
}
```

3. Atualizar model User:

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  role          Role     @default(USER)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  checkIns CheckIn[]

  @@index([email])
  @@index([created_at])
  @@map("users")
}
```

4. Gerar migration:
```bash
pnpm db:migrate
# Nome da migration: add_role_to_user
```

5. Verificar migration gerada em `prisma/migrations/`

6. Aplicar migration:
```bash
pnpm db:push
# Ou em produção: pnpm db:migrate:deploy
```

7. Regenerar Prisma Client:
```bash
pnpm db:generate
```

8. Testar no Prisma Studio:
```bash
pnpm db:studio
```

9. Verificar que usuários existentes têm role `USER`

10. Commit:
```bash
git add prisma/
git commit -m "feat: adiciona campo role ao User para autorização"
```

**Critérios de Sucesso:**
- ✅ Enum Role criado
- ✅ Campo role adicionado ao User com default USER
- ✅ Campo updated_at adicionado
- ✅ Migration criada e aplicada
- ✅ Prisma Client regenerado
- ✅ Usuários existentes têm role USER

**Alternativas:**
- Usar string em vez de enum (menos type-safe)
- Usar tabela separada de roles (mais complexo, mas mais flexível)

**Troubleshooting:**
- Se migration falhar: verificar se há dados e ajustar migration manualmente
- Se Prisma Client não atualizar: deletar `generated/` e regenerar

---

#### Tarefa 1.2: Instalar e Configurar @fastify/jwt

**O que fazer:**
Instalar biblioteca JWT e configurar no Fastify.

**Por quê:**
- Biblioteca oficial e bem mantida
- Integração perfeita com Fastify
- Suporta refresh tokens (opcional)

**Impacto:**
- ✅ Autenticação JWT funcional
- ✅ Base para proteger rotas
- ✅ Tokens seguros e assinados

**Passos:**

1. Instalar dependência:
```bash
pnpm add @fastify/jwt
```

2. Atualizar `src/config/env.ts`:

```typescript
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  PORT: z.coerce.number().default(3100),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format());
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
```

3. Atualizar `.env.example`:

```env
# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

4. Criar arquivo de configuração JWT:

`src/config/jwt.ts`:

```typescript
import { env } from './env';

export const jwtConfig = {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: env.JWT_EXPIRES_IN,
  },
};

export type JWTPayload = {
  sub: string; // user id
  email: string;
  role: 'ADMIN' | 'USER';
};
```

5. Registrar plugin no `src/config/app.ts`:

```typescript
import fastifyJwt from '@fastify/jwt';
import { jwtConfig } from './jwt';

// ... código existente ...

app.register(fastifyJwt, jwtConfig);
```

6. Adicionar tipos ao Fastify:

Criar `src/types/fastify.d.ts`:

```typescript
import type { FastifyJWT } from '@fastify/jwt';
import type { JWTPayload } from '@/config/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJWT<{ payload: JWTPayload }>;
  }
}
```

7. Atualizar `tsconfig.json` para incluir tipos:

```json
{
  "compilerOptions": {
    // ... existente ...
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

8. Testar configuração:

Criar teste simples `src/__tests__/jwt.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildTestApp } from './helpers/test-helpers';

describe('JWT Configuration', () => {
  it('should register JWT plugin', async () => {
    const app = await buildTestApp();
    expect(app.jwt).toBeDefined();
  });
});
```

9. Executar teste:
```bash
pnpm test src/__tests__/jwt.test.ts
```

10. Commit:
```bash
git add .
git commit -m "feat: configura @fastify/jwt para autenticação"
```

**Critérios de Sucesso:**
- ✅ @fastify/jwt instalado
- ✅ Configuração adicionada ao env
- ✅ Plugin registrado no Fastify
- ✅ Tipos TypeScript configurados
- ✅ Teste básico passando

**Alternativas:**
- Usar `jsonwebtoken` diretamente (menos integrado)
- Usar `@fastify/oauth2` para OAuth (mais complexo)

**Troubleshooting:**
- Se tipos não funcionarem: verificar `tsconfig.json` e reiniciar TypeScript server
- Se JWT_SECRET muito curto: usar gerador de secrets (ex: `openssl rand -base64 32`)

---

#### Tarefa 1.3: Criar Módulo de Autenticação

**O que fazer:**
Criar módulo completo de autenticação com login, registro e validação de tokens.

**Por quê:**
- Centraliza lógica de autenticação
- Facilita manutenção
- Segue padrão modular do projeto

**Impacto:**
- ✅ Autenticação funcional
- ✅ Código organizado
- ✅ Fácil de testar

**Estrutura a criar:**

```
src/modules/auth/
├── auth.service.ts        # Lógica de autenticação
├── auth.repository.ts     # Queries relacionadas a auth
├── auth.routes.ts         # Rotas de login/logout
├── auth.schemas.ts        # Schemas Zod
├── auth.middleware.ts     # Middleware de autenticação
└── __tests__/
    ├── auth.service.spec.ts
    └── auth.routes.spec.ts
```

**Passos:**

1. Criar estrutura de pastas:
```bash
mkdir -p src/modules/auth/__tests__
```

2. Criar `src/modules/auth/auth.schemas.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Login de usuário',
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
  response: {
    200: z.object({
      token: z.string(),
      user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        role: z.enum(['ADMIN', 'USER']),
      }),
    }),
  },
};

export const registerSchema = {
  tags: ['Auth'],
  summary: 'Registro de novo usuário',
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
  response: {
    201: z.object({
      token: z.string(),
      user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
      }),
    }),
  },
};

export type LoginSchema = z.infer<typeof loginSchema.body>;
export type RegisterSchema = z.infer<typeof registerSchema.body>;
```

3. Criar `src/modules/auth/auth.repository.ts`:

```typescript
import { prisma } from '@/infra/db/prisma';
import type { User } from '@prisma/client';

export const authRepository = {
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
};
```

4. Criar `src/modules/auth/auth.service.ts`:

```typescript
import { verify } from 'argon2';
import { hash } from 'argon2';
import type { FastifyInstance } from 'fastify';
import { ConflictError, UnauthorizedError } from '@/http/errors/app-error';
import { usersRepository } from '../users/users.repository';
import type { LoginSchema, RegisterSchema } from './auth.schemas';

export const authService = {
  async register(
    app: FastifyInstance,
    data: RegisterSchema,
  ): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
    const exists = await usersRepository.findByEmail(data.email);

    if (exists) {
      throw new ConflictError('User with same email already exists.');
    }

    const password_hash = await hash(data.password);

    const user = await usersRepository.create({
      name: data.name,
      email: data.email,
      password_hash,
    });

    const token = app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: 'USER', // Novo usuário sempre é USER
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: data.email,
      },
    };
  },

  async login(
    app: FastifyInstance,
    data: LoginSchema,
  ): Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }> {
    const user = await authRepository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const isPasswordValid = await verify(user.password_hash, data.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const token = app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};
```

5. Adicionar `UnauthorizedError` em `src/http/errors/app-error.ts`:

```typescript
// ... código existente ...

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'ERR_UNAUTHORIZED');
  }
}
```

6. Criar `src/modules/auth/auth.routes.ts`:

```typescript
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { authService } from './auth.service';
import { loginSchema, registerSchema } from './auth.schemas';

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register',
    {
      schema: registerSchema,
    },
    async (request, reply) => {
      const result = await authService.register(app, request.body);
      return reply.status(201).send(result);
    },
  );

  app.post(
    '/login',
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      const result = await authService.login(app, request.body);
      return reply.send(result);
    },
  );
};
```

7. Registrar rotas em `src/config/app.ts`:

```typescript
import { authRoutes } from '../modules/auth/auth.routes';

// ... código existente ...

app.register(authRoutes, { prefix: '/auth' });
```

8. Atualizar `users.routes.ts` para usar authService.register (ou manter separado):

**Decisão:** Manter registro em auth e listagem em users. Atualizar users para não ter mais POST.

9. Testar manualmente:

```bash
# Iniciar servidor
pnpm dev

# Em outro terminal, testar registro
curl -X POST http://localhost:3100/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Testar login
curl -X POST http://localhost:3100/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

10. Commit:
```bash
git add .
git commit -m "feat: implementa módulo de autenticação com login e registro"
```

**Critérios de Sucesso:**
- ✅ Módulo auth criado
- ✅ Login funcionando
- ✅ Registro funcionando
- ✅ Tokens JWT gerados corretamente
- ✅ Testes manuais passando

**Alternativas:**
- Usar refresh tokens (mais seguro, mas mais complexo)
- Implementar logout com blacklist de tokens (requer Redis)

**Troubleshooting:**
- Se hash não funcionar: verificar versão do argon2
- Se token não gerar: verificar JWT_SECRET configurado

---

#### Tarefa 1.4: Criar Middleware de Autenticação

**O que fazer:**
Criar middleware para proteger rotas que requerem autenticação.

**Por quê:**
- Reutilizável em múltiplas rotas
- Centraliza lógica de validação
- Facilita manutenção

**Impacto:**
- ✅ Rotas protegidas
- ✅ Código reutilizável
- ✅ Fácil de aplicar

**Passos:**

1. Criar `src/http/middlewares/auth.middleware.ts`:

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../errors/app-error';
import type { JWTPayload } from '@/config/jwt';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing token.');
  }
}

// Helper para obter usuário autenticado
export function getAuthenticatedUser(request: FastifyRequest): JWTPayload {
  return request.user as JWTPayload;
}
```

2. Criar `src/http/middlewares/authorize.middleware.ts`:

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../errors/app-error';
import { getAuthenticatedUser } from './auth.middleware';
import type { Role } from '@prisma/client';

export function authorize(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = getAuthenticatedUser(request);

    if (!allowedRoles.includes(user.role as Role)) {
      throw new ForbiddenError('Insufficient permissions.');
    }
  };
}
```

3. Adicionar `ForbiddenError` em `src/http/errors/app-error.ts`:

```typescript
// ... código existente ...

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, 'ERR_FORBIDDEN');
  }
}
```

4. Criar arquivo de exportação `src/http/middlewares/index.ts`:

```typescript
export { authenticate, getAuthenticatedUser } from './auth.middleware';
export { authorize } from './authorize.middleware';
```

5. Atualizar rota de usuários para usar autenticação:

`src/modules/users/users.routes.ts`:

```typescript
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { authenticate } from '@/http/middlewares';
import { listUsersSchema } from './users.schemas';
import { usersService } from './users.service';

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: listUsersSchema,
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const { page, limit } = request.query;
      const result = await usersService.findAll(page, limit);

      return reply.send(result);
    },
  );
};
```

6. Criar rota de perfil:

Adicionar em `users.routes.ts`:

```typescript
import { getAuthenticatedUser } from '@/http/middlewares';

// ... código existente ...

app.get(
  '/me',
  {
    schema: {
      tags: ['Users'],
      summary: 'Obter perfil do usuário logado',
      response: {
        200: userPublicSchema,
      },
    },
    preHandler: [authenticate],
  },
  async (request, reply) => {
    const user = getAuthenticatedUser(request);
    const profile = await usersService.findById(user.sub);

    return reply.send(profile);
  },
);
```

7. Adicionar método `findById` no service:

`src/modules/users/users.service.ts`:

```typescript
// ... código existente ...

async findById(userId: string) {
  const user = await usersRepository.findById(userId);
  
  if (!user) {
    throw new ResourceNotFoundError('User not found.');
  }

  return serializeUser(user);
}
```

8. Adicionar método no repository:

`src/modules/users/users.repository.ts`:

```typescript
// ... código existente ...

async findById(id: string): Promise<UserDTO | null> {
  return await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}
```

9. Testar manualmente:

```bash
# Obter token do login anterior
TOKEN="seu-token-aqui"

# Testar rota protegida
curl -X GET http://localhost:3100/users \
  -H "Authorization: Bearer $TOKEN"

# Testar perfil
curl -X GET http://localhost:3100/users/me \
  -H "Authorization: Bearer $TOKEN"
```

10. Commit:
```bash
git add .
git commit -m "feat: implementa middleware de autenticação e autorização"
```

**Critérios de Sucesso:**
- ✅ Middleware de autenticação criado
- ✅ Middleware de autorização criado
- ✅ Rotas protegidas funcionando
- ✅ Rotas sem token retornam 401
- ✅ Rotas com token inválido retornam 401
- ✅ Testes manuais passando

**Alternativas:**
- Usar decorators (mais complexo, mas mais elegante)
- Validar token em cada rota (menos reutilizável)

**Troubleshooting:**
- Se middleware não executar: verificar ordem de registro
- Se token não validar: verificar formato do header (Bearer token)

---

#### Tarefa 1.5: Proteger Rotas Admin

**O que fazer:**
Aplicar autorização em rotas que requerem role ADMIN.

**Por quê:**
- Implementa controle de acesso
- Protege funcionalidades administrativas
- Requisito do projeto

**Impacto:**
- ✅ Rotas admin protegidas
- ✅ Apenas admins podem acessar
- ✅ Base para funcionalidades admin futuras

**Passos:**

1. Criar usuário admin manualmente (temporário):

```bash
# Via Prisma Studio ou SQL direto
pnpm db:studio
# Atualizar role de um usuário para ADMIN
```

2. Criar rota de exemplo protegida:

Por enquanto, vamos preparar a estrutura. Quando implementar módulos de gyms e check-ins, aplicar autorização.

3. Atualizar `users.routes.ts` para ter rota admin de exemplo:

```typescript
import { authenticate, authorize } from '@/http/middlewares';
import { Role } from '@prisma/client';

// ... código existente ...

// Exemplo: Rota admin para listar todos os usuários (sem paginação)
app.get(
  '/admin/all',
  {
    schema: {
      tags: ['Users'],
      summary: 'Listar todos os usuários (apenas admin)',
      response: {
        200: z.array(userPublicSchema),
      },
    },
    preHandler: [authenticate, authorize(Role.ADMIN)],
  },
  async (request, reply) => {
    const users = await usersService.findAllAdmin();
    return reply.send(users);
  },
);
```

4. Adicionar método no service (se necessário):

```typescript
async findAllAdmin() {
  return await usersRepository.findAllAdmin();
}
```

5. Testar:

```bash
# Login como admin
TOKEN_ADMIN="token-do-admin"

# Tentar acessar rota admin
curl -X GET http://localhost:3100/users/admin/all \
  -H "Authorization: Bearer $TOKEN_ADMIN"

# Login como user normal
TOKEN_USER="token-do-user"

# Tentar acessar (deve retornar 403)
curl -X GET http://localhost:3100/users/admin/all \
  -H "Authorization: Bearer $TOKEN_USER"
```

6. Commit:
```bash
git add .
git commit -m "feat: protege rotas admin com middleware de autorização"
```

**Critérios de Sucesso:**
- ✅ Rotas admin protegidas
- ✅ Usuários normais recebem 403
- ✅ Admins conseguem acessar
- ✅ Testes manuais passando

---

### 4.4 Validação da Fase 1

**Checklist:**
- [ ] Schema Prisma atualizado com role
- [ ] @fastify/jwt instalado e configurado
- [ ] Módulo de autenticação criado
- [ ] Login funcionando
- [ ] Registro funcionando
- [ ] Middleware de autenticação criado
- [ ] Middleware de autorização criado
- [ ] Rotas protegidas funcionando
- [ ] Rotas admin protegidas
- [ ] Testes manuais passando
- [ ] Documentação atualizada

**Testes Finais:**

1. Testar fluxo completo:
   - Registro → Login → Acessar rota protegida → Acessar rota admin

2. Testar casos de erro:
   - Token inválido → 401
   - Token expirado → 401
   - Usuário normal acessando rota admin → 403
   - Sem token → 401

**Próxima Fase:** Fase 2 - Segurança Crítica (Headers e Configurações)

---

## 5. Fase 2: Segurança Crítica - Headers e Configurações

**Duração Estimada:** 2-3 dias  
**Prioridade:** 🔴 Crítica  
**Dependências:** Fase 1 completa

### 5.1 Objetivo

Implementar headers de segurança HTTP e melhorar configurações de segurança (CORS, Rate Limiting).

### 5.2 Tarefas Detalhadas

#### Tarefa 2.1: Implementar @fastify/helmet

**O que fazer:**
Instalar e configurar @fastify/helmet para adicionar headers de segurança HTTP.

**Por quê:**
- Protege contra XSS, clickjacking, MIME sniffing
- Headers de segurança essenciais para produção
- Fácil de implementar

**Impacto:**
- ✅ Proteção contra ataques comuns
- ✅ Headers de segurança configurados
- ✅ Mais seguro para produção

**Passos:**

1. Instalar:
```bash
pnpm add @fastify/helmet
```

2. Configurar em `src/config/app.ts`:

```typescript
import fastifyHelmet from '@fastify/helmet';
import { env } from './env';

// ... código existente ...

app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Para Swagger UI
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Pode causar problemas com Swagger
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
```

3. Testar headers:

```bash
curl -I http://localhost:3100/users
```

4. Verificar headers presentes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (se HTTPS)

5. Commit:
```bash
git add .
git commit -m "feat: adiciona headers de segurança com @fastify/helmet"
```

**Critérios de Sucesso:**
- ✅ Helmet instalado e configurado
- ✅ Headers de segurança presentes
- ✅ Swagger ainda funciona
- ✅ Testes manuais passando

---

#### Tarefa 2.2: Melhorar Configuração de CORS

**O que fazer:**
Configurar CORS adequadamente com whitelist de origens por ambiente.

**Por quê:**
- `origin: true` é muito permissivo para produção
- Risco de segurança
- Boa prática

**Impacto:**
- ✅ Mais seguro
- ✅ Controle sobre origens permitidas
- ✅ Diferenciação por ambiente

**Passos:**

1. Atualizar `src/config/env.ts`:

```typescript
const envSchema = z.object({
  // ... existente ...
  CORS_ORIGINS: z.string().optional().default('*'),
});
```

2. Atualizar `src/config/app.ts`:

```typescript
const allowedOrigins = env.NODE_ENV === 'production'
  ? env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.register(fastifyCors, {
  origin: (origin, cb) => {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) {
      cb(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

3. Atualizar `.env.example`:

```env
# CORS (separar múltiplas origens por vírgula)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. Testar:

```bash
# Deve funcionar
curl -X GET http://localhost:3100/users \
  -H "Origin: http://localhost:3000"

# Em produção, origem não permitida deve falhar
```

5. Commit:
```bash
git add .
git commit -m "feat: melhora configuração de CORS com whitelist"
```

**Critérios de Sucesso:**
- ✅ CORS configurado por ambiente
- ✅ Whitelist funcionando
- ✅ Testes manuais passando

---

#### Tarefa 2.3: Melhorar Rate Limiting

**O que fazer:**
Ajustar rate limiting para ser mais restritivo e diferenciado por rota.

**Por quê:**
- 100 req/min é muito permissivo
- Diferentes rotas precisam de limites diferentes
- Proteção contra DDoS

**Impacto:**
- ✅ Mais seguro
- ✅ Proteção adequada
- ✅ Diferenciação por tipo de rota

**Passos:**

1. Atualizar rate limiting global em `src/config/app.ts`:

```typescript
// Rate limit global mais restritivo
app.register(fastifyRateLimit, {
  redis,
  max: 50, // Reduzido de 100
  timeWindow: '1 minute',
  skipOnError: false,
});
```

2. Adicionar rate limit específico para login:

```typescript
// Rate limit para autenticação (mais restritivo)
app.register(
  async (app) => {
    app.register(fastifyRateLimit, {
      redis,
      max: 5, // Apenas 5 tentativas por minuto
      timeWindow: '1 minute',
      skipOnError: false,
    });
  },
  { prefix: '/auth' },
);
```

3. Criar arquivo de configuração `src/config/rate-limit.ts`:

```typescript
export const rateLimitConfig = {
  global: {
    max: 50,
    timeWindow: '1 minute',
  },
  auth: {
    max: 5,
    timeWindow: '1 minute',
  },
  // Futuro: adicionar outros limites
} as const;
```

4. Testar:

```bash
# Fazer 6 requisições rápidas para /auth/login
# A 6ª deve retornar 429 Too Many Requests
```

5. Commit:
```bash
git add .
git commit -m "feat: melhora rate limiting com limites diferenciados"
```

**Critérios de Sucesso:**
- ✅ Rate limit global reduzido
- ✅ Rate limit específico para auth
- ✅ Testes manuais passando
- ✅ Erro 429 retornado quando excedido

---

### 5.3 Validação da Fase 2

**Checklist:**
- [ ] @fastify/helmet instalado e configurado
- [ ] Headers de segurança presentes
- [ ] CORS configurado com whitelist
- [ ] Rate limiting melhorado
- [ ] Testes manuais passando

**Próxima Fase:** Fase 3 - Schema e Banco de Dados

---

## 6. Fase 3: Schema e Banco de Dados

**Duração Estimada:** 3-4 dias  
**Prioridade:** 🔴 Crítica  
**Dependências:** Fase 1 completa (role já adicionado)

### 6.1 Objetivo

Completar schema Prisma, adicionar índices e otimizar banco de dados.

### 6.2 Tarefas Detalhadas

#### Tarefa 3.1: Adicionar Índices ao Schema

**O que fazer:**
Adicionar índices estratégicos para otimizar queries.

**Por quê:**
- Melhora performance de queries
- Essencial para escalabilidade
- Boa prática de banco de dados

**Impacto:**
- ✅ Queries mais rápidas
- ✅ Melhor performance
- ✅ Escalável

**Passos:**

1. Atualizar `prisma/schema.prisma`:

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  role          Role     @default(USER)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  checkIns CheckIn[]

  @@index([email]) // Já tem @unique, mas índice explícito ajuda
  @@index([created_at]) // Para ordenação
  @@map("users")
}

model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  user    User   @relation(fields: [user_id], references: [id])
  user_id String
  gym     Gym    @relation(fields: [gym_id], references: [id])
  gym_id  String

  @@index([user_id, created_at]) // Para histórico do usuário
  @@index([gym_id]) // Para check-ins de uma academia
  @@index([created_at]) // Para validação (20 minutos)
  @@index([user_id, created_at]) // Composto para busca eficiente
  @@map("check_ins")
}

model Gym {
  id          String  @id @default(uuid())
  title       String
  description String?
  phone       String?
  latitude    Decimal
  longitude   Decimal

  checkIns CheckIn[]

  @@index([latitude, longitude]) // Para busca por proximidade
  @@map("gyms")
}
```

2. Criar migration:
```bash
pnpm db:migrate
# Nome: add_indexes_to_models
```

3. Aplicar migration:
```bash
pnpm db:push
```

4. Verificar índices criados:
```bash
# Via Prisma Studio ou SQL direto
pnpm db:studio
```

5. Commit:
```bash
git add prisma/
git commit -m "feat: adiciona índices para otimizar queries"
```

**Critérios de Sucesso:**
- ✅ Índices adicionados ao schema
- ✅ Migration criada
- ✅ Índices criados no banco
- ✅ Performance melhorada

---

#### Tarefa 3.2: Configurar Connection Pooling

**O que fazer:**
Configurar connection pooling do Prisma adequadamente.

**Por quê:**
- Melhora performance
- Evita esgotamento de conexões
- Essencial para produção

**Impacto:**
- ✅ Melhor gerenciamento de conexões
- ✅ Mais eficiente
- ✅ Pronto para carga

**Passos:**

1. Atualizar `src/infra/db/prisma.ts`:

```typescript
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '@/config/env';
import { PrismaClient } from '../../../generated/prisma/client';

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ 
  connectionString,
  // Configuração de pool
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});

const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
```

2. Adicionar variáveis de ambiente (opcional):

```env
# Database Pool (opcional, usa padrão se não especificado)
DB_POOL_MIN=2
DB_POOL_MAX=10
```

3. Testar conexão:
```bash
pnpm dev
# Verificar logs de conexão
```

4. Commit:
```bash
git add .
git commit -m "feat: configura connection pooling do Prisma"
```

**Critérios de Sucesso:**
- ✅ Pool configurado
- ✅ Graceful shutdown implementado
- ✅ Logs adequados

---

### 6.3 Validação da Fase 3

**Checklist:**
- [ ] Índices adicionados
- [ ] Migrations aplicadas
- [ ] Connection pooling configurado
- [ ] Performance melhorada

**Próxima Fase:** Fase 4 - Testes (Configuração)

---

## 7. Fase 4: Testes - Configuração e Base

**Duração Estimada:** 2-3 dias  
**Prioridade:** 🔴 Crítica  
**Dependências:** Fase 0 completa

### 7.1 Objetivo

Configurar ambiente de testes completo e criar base para testes.

### 7.2 Tarefas Detalhadas

#### Tarefa 4.1: Configurar Banco de Dados para Testes

**O que fazer:**
Configurar banco de dados isolado para testes.

**Por quê:**
- Isolamento de testes
- Não polui banco de desenvolvimento
- Permite testes paralelos

**Impacto:**
- ✅ Testes isolados
- ✅ Mais confiável
- ✅ Pode rodar em paralelo

**Passos:**

1. Criar `src/__tests__/setup/database.ts`:

```typescript
import { PrismaClient } from '../../../generated/prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TEST_DATABASE_URL || 'postgresql://docker:docker@localhost:5432/gympass_test',
});

export async function setupTestDatabase() {
  // Resetar banco
  execSync('pnpm db:push --skip-generate', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
}

export { prisma as testPrisma };
```

2. Atualizar `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/__tests__/setup/test-setup.ts'],
    // ... coverage existente ...
  },
});
```

3. Criar `src/__tests__/setup/test-setup.ts`:

```typescript
import { beforeAll, afterAll } from 'vitest';
import { setupTestDatabase, teardownTestDatabase } from './database';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});
```

4. Adicionar `TEST_DATABASE_URL` ao `.env.example`:

```env
TEST_DATABASE_URL=postgresql://docker:docker@localhost:5432/gympass_test
```

5. Criar banco de testes:
```bash
# Via docker-compose ou SQL direto
createdb gympass_test
```

6. Testar:
```bash
pnpm test
```

7. Commit:
```bash
git add .
git commit -m "test: configura banco de dados isolado para testes"
```

**Critérios de Sucesso:**
- ✅ Banco de testes configurado
- ✅ Setup/teardown funcionando
- ✅ Testes isolados

---

#### Tarefa 4.2: Criar Factories e Helpers de Teste

**O que fazer:**
Criar factories para gerar dados de teste facilmente.

**Por quê:**
- Facilita criação de testes
- Dados consistentes
- Reutilizável

**Impacto:**
- ✅ Testes mais fáceis de escrever
- ✅ Menos código boilerplate
- ✅ Mais manutenível

**Passos:**

1. Expandir `src/__tests__/fixtures/user.fixtures.ts`:

```typescript
import type { Prisma } from 'generated/prisma/client';
import { testPrisma } from '../setup/database';
import { hash } from 'argon2';

export const createUserFixture = async (
  overrides?: Partial<Prisma.UserCreateInput>,
): Promise<Prisma.UserGetPayload<{ select: { id: true; name: true; email: true; role: true } }>> => {
  const password_hash = overrides?.password_hash || await hash('password123');
  
  const user = await testPrisma.user.create({
    data: {
      name: 'John Doe',
      email: `john-${Math.random().toString(36).substring(7)}@example.com`,
      password_hash,
      role: 'USER',
      ...overrides,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const createAdminFixture = async (
  overrides?: Partial<Prisma.UserCreateInput>,
) => {
  return createUserFixture({
    role: 'ADMIN',
    ...overrides,
  });
};
```

2. Criar helpers adicionais em `src/__tests__/helpers/test-helpers.ts`:

```typescript
import type { FastifyInstance } from 'fastify';
import { app } from '@/config/app';

export async function buildTestApp(): Promise<FastifyInstance> {
  return app;
}

export function generateRandomEmail(): string {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomString(length = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}

export async function generateAuthToken(
  app: FastifyInstance,
  userId: string,
  email: string,
  role: 'ADMIN' | 'USER' = 'USER',
): Promise<string> {
  return app.jwt.sign({
    sub: userId,
    email,
    role,
  });
}
```

3. Commit:
```bash
git add .
git commit -m "test: cria factories e helpers para testes"
```

**Critérios de Sucesso:**
- ✅ Factories criadas
- ✅ Helpers úteis criados
- ✅ Fácil de usar em testes

---

### 7.3 Validação da Fase 4

**Checklist:**
- [ ] Banco de testes configurado
- [ ] Setup/teardown funcionando
- [ ] Factories criadas
- [ ] Helpers criados
- [ ] Testes básicos passando

**Próxima Fase:** Fase 5 - Testes (Implementação)

---

## 8. Fase 5: Testes - Implementação

**Duração Estimada:** 2-3 semanas  
**Prioridade:** 🔴 Crítica  
**Dependências:** Fase 4 completa

### 8.1 Objetivo

Implementar testes abrangentes alcançando 80%+ de cobertura.

### 8.2 Estratégia de Testes

**Ordem de implementação:**
1. Testes unitários de services
2. Testes unitários de repositories
3. Testes de integração de rotas
4. Testes E2E de fluxos completos

### 8.3 Tarefas Detalhadas

#### Tarefa 5.1: Testes Unitários - Auth Service

**O que fazer:**
Escrever testes unitários completos para auth.service.ts.

**Passos:**

1. Criar `src/modules/auth/__tests__/auth.service.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth.service';
import { authRepository } from '../auth.repository';
import { usersRepository } from '../../users/users.repository';
import { ConflictError, UnauthorizedError } from '@/http/errors/app-error';
import { createUserFixture } from '@/__tests__/fixtures/user.fixtures';
import { buildTestApp, generateAuthToken } from '@/__tests__/helpers/test-helpers';

vi.mock('../auth.repository');
vi.mock('../../users/users.repository');

describe('AuthService', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>;

  beforeEach(async () => {
    app = await buildTestApp();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      vi.mocked(usersRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(usersRepository.create).mockResolvedValue({
        id: '123',
        name: 'John Doe',
      });

      // Act
      const result = await authService.register(app, userData);

      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.name).toBe(userData.name);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(usersRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if email already exists', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      vi.mocked(usersRepository.findByEmail).mockResolvedValue({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: new Date(),
      });

      // Act & Assert
      await expect(authService.register(app, userData)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await createUserFixture();
      vi.mocked(authRepository.findByEmailWithPassword).mockResolvedValue({
        ...user,
        password_hash: 'hashed_password',
      } as any);

      // Mock argon2 verify
      vi.mock('argon2', async () => {
        const actual = await vi.importActual('argon2');
        return {
          ...actual,
          verify: vi.fn().mockResolvedValue(true),
        };
      });

      // Act
      const result = await authService.login(app, loginData);

      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(loginData.email);
    });

    it('should throw UnauthorizedError with invalid email', async () => {
      // Arrange
      const loginData = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      vi.mocked(authRepository.findByEmailWithPassword).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(app, loginData)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError with invalid password', async () => {
      // Arrange
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const user = await createUserFixture();
      vi.mocked(authRepository.findByEmailWithPassword).mockResolvedValue({
        ...user,
        password_hash: 'hashed_password',
      } as any);

      // Mock argon2 verify to return false
      vi.mock('argon2', async () => {
        const actual = await vi.importActual('argon2');
        return {
          ...actual,
          verify: vi.fn().mockResolvedValue(false),
        };
      });

      // Act & Assert
      await expect(authService.login(app, loginData)).rejects.toThrow(UnauthorizedError);
    });
  });
});
```

2. Executar testes:
```bash
pnpm test src/modules/auth/__tests__/auth.service.spec.ts
```

3. Ajustar mocks e implementação conforme necessário

4. Commit:
```bash
git add .
git commit -m "test: adiciona testes unitários para auth.service"
```

**Critérios de Sucesso:**
- ✅ Todos os casos de teste implementados
- ✅ Cobertura alta (>90%)
- ✅ Testes passando
- ✅ Mocks adequados

---

#### Tarefa 5.2: Testes de Integração - Auth Routes

**O que fazer:**
Escrever testes de integração para rotas de autenticação.

**Passos:**

1. Criar `src/modules/auth/__tests__/auth.routes.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildTestApp } from '@/__tests__/helpers/test-helpers';
import { testPrisma } from '@/__tests__/setup/database';
import { createUserFixture } from '@/__tests__/fixtures/user.fixtures';

describe('Auth Routes', () => {
  let app: Awaited<ReturnType<typeof buildTestApp>>;

  beforeEach(async () => {
    app = await buildTestApp();
    // Limpar banco antes de cada teste
    await testPrisma.user.deleteMany();
  });

  afterEach(async () => {
    await testPrisma.user.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
      expect(body.user.email).toBe('john@example.com');
    });

    it('should return 409 if email already exists', async () => {
      await createUserFixture({ email: 'john@example.com' });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(409);
    });

    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name: 'Jo', // Muito curto
          email: 'invalid-email',
          password: '123', // Muito curto
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const user = await createUserFixture({
        email: 'john@example.com',
        password_hash: await hash('password123'),
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'john@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'john@example.com',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
```

2. Executar testes:
```bash
pnpm test src/modules/auth/__tests__/auth.routes.spec.ts
```

3. Commit:
```bash
git add .
git commit -m "test: adiciona testes de integração para auth.routes"
```

**Critérios de Sucesso:**
- ✅ Testes de integração implementados
- ✅ Todos os casos cobertos
- ✅ Testes passando

---

#### Tarefa 5.3: Repetir para Outros Módulos

**O que fazer:**
Implementar testes para users.service, users.repository, users.routes seguindo o mesmo padrão.

**Ordem:**
1. users.service.spec.ts
2. users.repository.spec.ts
3. users.routes.spec.ts

**Meta de Cobertura:** 80%+

---

### 8.4 Validação da Fase 5

**Checklist:**
- [ ] Testes unitários implementados
- [ ] Testes de integração implementados
- [ ] Cobertura >80%
- [ ] Todos os testes passando
- [ ] Mocks adequados

**Verificar cobertura:**
```bash
pnpm test:cov
```

**Próxima Fase:** Fase 6 - Observabilidade

---

## 9. Fase 6: Observabilidade

**Duração Estimada:** 1 semana  
**Prioridade:** 🟡 Alta  
**Dependências:** Fases anteriores

### 9.1 Objetivo

Implementar observabilidade completa (health checks, logging, métricas).

### 9.2 Tarefas Principais

#### Tarefa 6.1: Health Checks

1. Instalar `@fastify/under-pressure`
2. Criar endpoint `/health`
3. Verificar dependências (DB, Redis)

#### Tarefa 6.2: Correlation IDs

1. Criar middleware
2. Adicionar aos logs
3. Incluir em respostas de erro

#### Tarefa 6.3: Structured Logging

1. Melhorar configuração do Pino
2. Adicionar contexto
3. Configurar níveis por ambiente

#### Tarefa 6.4: Error Tracking (Opcional)

1. Integrar Sentry
2. Configurar alertas
3. Adicionar contexto

---

## 10. Fase 7: Performance

**Duração Estimada:** 1 semana  
**Prioridade:** 🟡 Alta  
**Dependências:** Fases anteriores

### 10.1 Tarefas Principais

#### Tarefa 7.1: Compressão

1. Instalar `@fastify/compress`
2. Configurar compressão
3. Testar impacto

#### Tarefa 7.2: Otimizar Cache

1. TTLs diferentes por tipo
2. Cache de queries individuais
3. Cache warming

#### Tarefa 7.3: Otimizar Queries

1. Revisar queries existentes
2. Adicionar índices faltantes
3. Considerar cursor-based pagination

---

## 11. Fase 8: Refatoração e Arquitetura

**Duração Estimada:** 2 semanas  
**Prioridade:** 🟢 Média  
**Dependências:** Fases anteriores

### 11.1 Tarefas Principais

#### Tarefa 8.1: Desacoplar Circuit Breaker

1. Criar interface para logger
2. Injetar dependências
3. Tornar genérico

#### Tarefa 8.2: Criar Abstrações

1. Interfaces para repositories
2. Interfaces para services
3. Dependency injection

#### Tarefa 8.3: Extrair Constantes

1. Criar arquivo de constantes
2. Extrair valores mágicos
3. Documentar

#### Tarefa 8.4: Melhorar Estrutura

1. Reorganizar pastas
2. Criar middlewares
3. Organizar tipos

---

## 12. Fase 9: Documentação

**Duração Estimada:** 1 semana  
**Prioridade:** 🟢 Média  
**Dependências:** Todas as fases anteriores

### 12.1 Tarefas Principais

#### Tarefa 9.1: README Técnico

1. Arquitetura
2. Setup
3. Desenvolvimento
4. Deploy

#### Tarefa 9.2: Documentar API

1. Melhorar Swagger
2. Adicionar exemplos
3. Documentar erros

#### Tarefa 9.3: Guias

1. Guia de desenvolvimento
2. Guia de testes
3. Guia de deploy

---

## 13. Checklist de Validação Final

### 13.1 Segurança
- [ ] Autenticação JWT implementada
- [ ] Autorização por roles implementada
- [ ] Headers de segurança configurados
- [ ] CORS adequadamente configurado
- [ ] Rate limiting adequado
- [ ] Secrets não expostos

### 13.2 Testes
- [ ] Cobertura >80%
- [ ] Testes unitários implementados
- [ ] Testes de integração implementados
- [ ] Testes E2E implementados
- [ ] Todos os testes passando

### 13.3 Performance
- [ ] Índices no banco
- [ ] Cache otimizado
- [ ] Compressão configurada
- [ ] Queries otimizadas

### 13.4 Observabilidade
- [ ] Health checks implementados
- [ ] Logging estruturado
- [ ] Correlation IDs
- [ ] Métricas (opcional)

### 13.5 Código
- [ ] Código limpo
- [ ] Sem acoplamentos desnecessários
- [ ] Abstrações adequadas
- [ ] Documentação inline

### 13.6 Documentação
- [ ] README completo
- [ ] API documentada
- [ ] Guias criados
- [ ] ADRs (opcional)

---

## 14. Riscos e Mitigações

### 14.1 Riscos Técnicos

**Risco:** Migrations podem falhar em produção  
**Mitigação:** Testar migrations em ambiente de staging primeiro

**Risco:** Testes podem ser lentos  
**Mitigação:** Otimizar setup/teardown, usar testes paralelos

**Risco:** Breaking changes em dependências  
**Mitigação:** Fixar versões, testar atualizações isoladamente

### 14.2 Riscos de Prazo

**Risco:** Subestimação de esforço  
**Mitigação:** Buffer de 20% no tempo estimado

**Risco:** Bloqueadores inesperados  
**Mitigação:** Priorizar itens críticos primeiro

### 14.3 Riscos de Qualidade

**Risco:** Cobertura de testes insuficiente  
**Mitigação:** Definir threshold mínimo, revisar regularmente

**Risco:** Bugs em produção  
**Mitigação:** Testes abrangentes, code review, staging

---

## 15. Conclusão

Este guia fornece um caminho claro e detalhado para transformar a aplicação em um projeto maduro e robusto. Siga as fases em ordem, validando cada etapa antes de prosseguir.

**Lembre-se:**
- ✅ Valide cada fase antes de prosseguir
- ✅ Faça commits frequentes
- ✅ Documente enquanto desenvolve
- ✅ Teste tudo
- ✅ Revise código antes de merge

**Boa sorte! 🚀**

