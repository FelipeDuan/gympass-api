# 🏋️ GymPass API - Backend Boilerplate

API backend construída com Node.js, TypeScript, Fastify, PostgreSQL e Redis. Este projeto serve como **laboratório experimental** para desenvolver e validar padrões arquiteturais que serão utilizados em um boilerplate backend oficial.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Começar](#como-começar)
- [Documentação](#documentação)
- [Arquitetura](#arquitetura)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [CI/CD](#cicd)

---

## Sobre o Projeto

Este repositório é um **projeto experimental** que visa:

- ✅ Testar e validar padrões arquiteturais
- ✅ Desenvolver uma base técnica sólida e reutilizável
- ✅ Criar um boilerplate backend enterprise-grade
- ✅ Aplicar princípios SOLID e Clean Architecture
- ✅ Garantir alta qualidade de código e testabilidade

**⚠️ Status:** Em desenvolvimento ativo - Base arquitetural sendo consolidada

---

## Stack Tecnológica

### Core

- **Runtime:** Node.js 22.x (LTS)
- **Linguagem:** TypeScript 5.9+ (strict mode)
- **Framework:** Fastify 5.x
- **ORM:** Prisma 7.x
- **Validação:** Zod 4.x

### Infraestrutura

- **Banco de Dados:** PostgreSQL 17
- **Cache:** Redis 7
- **Autenticação:** JWT (JSON Web Tokens)
- **Hash de Senhas:** Argon2

### Ferramentas de Desenvolvimento

- **Testes:** Vitest 4.x
- **Linting:** Biome 2.x
- **Type Checking:** TypeScript strict mode
- **CI/CD:** GitHub Actions

---

## Estrutura do Projeto

```
src/
├── config/              # Configurações da aplicação
│   ├── plugins/        # Plugins do Fastify organizados
│   ├── app.ts          # Instância do Fastify
│   ├── env.ts          # Validação de variáveis de ambiente
│   └── *.ts            # Outras configurações
├── core/               # Lógica core compartilhada
│   ├── domain/        # Entidades e Value Objects (quando necessário)
│   ├── interfaces/    # Contratos e interfaces compartilhadas
│   ├── shared/        # Utilitários compartilhados
│   │   ├── types/     # Tipos TypeScript compartilhados
│   │   └── utils/     # Funções utilitárias
│   └── di/            # Dependency Injection
├── http/               # Camada HTTP
│   ├── errors/        # Classes de erro customizadas
│   ├── middlewares/   # Middlewares HTTP
│   └── error-handler.ts
├── infrastructure/     # Infraestrutura (implementações concretas)
│   ├── auth/         # Serviços de autenticação
│   ├── cache/        # Implementação de cache (Redis)
│   ├── database/     # Implementação de banco (Prisma)
│   ├── health/       # Health check endpoint
│   ├── logger/       # Implementação de logger
│   ├── monitoring/    # Métricas internas
│   ├── monitoring-endpoint/  # Endpoint de monitoramento
│   └── resilience/   # Circuit breaker, retry, etc.
├── modules/            # Módulos de domínio (feature-based)
│   └── {module-name}/
│       ├── {module}.routes.ts      # Rotas HTTP
│       ├── {module}.service.ts     # Lógica de negócio
│       ├── {module}.repository.ts  # Acesso a dados
│       ├── {module}.schemas.ts     # Schemas Zod
│       ├── {module}.dto.ts         # DTOs e selects
│       ├── {module}.serializers.ts # Serialização de respostas
│       └── __tests__/              # Testes do módulo
├── types/              # Tipos TypeScript globais
└── server.ts           # Entry point da aplicação
```

### Princípios da Estrutura

- **Separação de Responsabilidades:** Cada camada tem uma responsabilidade única
- **Proximidade Lógica:** Arquivos relacionados ficam próximos
- **Módulos por Domínio:** Features organizadas por domínio de negócio
- **Infraestrutura Isolada:** Implementações técnicas separadas do domínio

---

## Como Começar

### Pré-requisitos

- Node.js 22.x ou superior
- pnpm 9.x ou superior
- PostgreSQL 17
- Redis 7

### Instalação

1. **Clone o repositório:**

```bash
git clone <repository-url>
cd gympass-api
```

2. **Instale as dependências:**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. **Configure o banco de dados:**

```bash
# Inicie PostgreSQL e Redis (via Docker ou localmente)
docker-compose up -d

# Execute as migrations
pnpm db:migrate

# Gere o Prisma Client
pnpm db:generate
```

5. **Inicie o servidor:**

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3100` (ou porta configurada em `.env`).

### Documentação da API

Quando o servidor estiver rodando em modo `dev`, a documentação interativa está disponível em:

- **Swagger UI:** `http://localhost:3100/docs`
- **Scalar UI:** `http://localhost:3100/docs` (alternativa)

---

## Documentação

### 📚 Documentação Completa

A documentação completa está disponível na pasta `docs/`:

- **[Fluxo Completo da Aplicação](./docs/fluxo-aplicacao.md)** - Como uma requisição flui pela aplicação
- **[Middlewares](./docs/middlewares.md)** - Guia completo de middlewares disponíveis
- **[Variáveis de Ambiente](./docs/variaveis-ambiente.md)** - Todas as variáveis de ambiente
- **[CI/CD e DevOps](./docs/guia-ci-cd-devops.md)** - Guia de CI/CD e DevOps
- **[Diagnóstico Completo](./docs/diagnostico-completo-2025.md)** - Análise arquitetural completa
- **[Plano de Ação](./docs/plano-acao-refatoracao.md)** - Plano de refatoração e melhorias

### 🚀 Guias Rápidos

#### Criando um Novo Módulo

1. Crie a estrutura básica em `src/modules/{module-name}/`:
   - `{module}.routes.ts` - Rotas HTTP
   - `{module}.service.ts` - Lógica de negócio
   - `{module}.repository.ts` - Acesso a dados
   - `{module}.schemas.ts` - Schemas Zod
   - `{module}.dto.ts` - DTOs
   - `{module}.serializers.ts` - Serialização

2. Registre as rotas em `src/config/plugins/routes.config.ts`

3. Crie os testes em `src/modules/{module-name}/__tests__/`

**📖 Exemplo completo:** Em breve será criado um exemplo didático completo.

---

## Arquitetura

### Camadas da Aplicação

A aplicação segue uma arquitetura em **camadas**, onde cada camada tem responsabilidades bem definidas:

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

### Princípios Arquiteturais

- **SOLID:** Princípios SOLID rigorosamente aplicados
- **Separação de Responsabilidades:** Cada camada tem uma única responsabilidade
- **Dependency Injection:** Preparado para DI completo (em transição)
- **Type Safety:** TypeScript strict mode sempre habilitado
- **Testabilidade:** Toda funcionalidade deve ser testável

### Regras de Dependência

```
modules/ → pode depender de → core/, http/errors, types/
modules/ → NÃO PODE depender de → infrastructure/, config/

infrastructure/ → pode depender de → core/interfaces, config/, types/
infrastructure/ → NÃO PODE depender de → modules/

http/ → pode depender de → modules/, core/, types/
http/ → NÃO PODE depender de → infrastructure/ diretamente

core/ → pode depender de → types/
core/ → NÃO PODE depender de → modules/, infrastructure/, http/
```

---

## Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor em modo desenvolvimento
pnpm build            # Compila TypeScript
pnpm start            # Inicia servidor em modo produção

# Banco de Dados
pnpm db:migrate       # Executa migrations
pnpm db:generate      # Gera Prisma Client
pnpm db:studio        # Abre Prisma Studio

# Qualidade de Código
pnpm lint             # Executa linter
pnpm lint:fix         # Corrige problemas do linter
pnpm typecheck        # Verifica tipos TypeScript
pnpm format           # Formata código

# Testes
pnpm test             # Executa todos os testes
pnpm test:watch       # Executa testes em modo watch
pnpm test:coverage    # Gera relatório de cobertura
```

### Convenções de Código

- **Arquivos:** `kebab-case.ts` ou `camelCase.ts` (seguir padrão do módulo)
- **Exports:** `camelCase` para objetos/funções, `PascalCase` para classes
- **Variáveis e Funções:** `camelCase`
- **Classes e Tipos:** `PascalCase`
- **Constantes:** `UPPER_SNAKE_CASE`

### Path Aliases

```typescript
import { something } from '@/config/...';        // src/config/...
import { something } from '@/core/...';          // src/core/...
import { something } from '@/http/...';          // src/http/...
import { something } from '@/infrastructure/...'; // src/infrastructure/...
import { something } from '@/modules/...';       // src/modules/...
```

---

## Testes

### Estrutura de Testes

```
src/
├── modules/
│   └── {module}/
│       └── __tests__/
│           ├── unit/              # Testes unitários
│           └── integration/       # Testes de integração
└── __tests__/
    ├── helpers/                   # Helpers para testes
    └── setup/                     # Setup de testes
```

### Executando Testes

```bash
# Todos os testes
pnpm test

# Apenas testes unitários
pnpm test src/**/__tests__/unit/

# Apenas testes de integração
pnpm test src/**/__tests__/integration/

# Com cobertura
pnpm test:coverage
```

### Cobertura Mínima

- **Cobertura mínima:** 80%
- **Thresholds configurados em:** `vitest.config.ts`

---

## CI/CD

O projeto utiliza **GitHub Actions** para CI/CD:

- **CI:** Executa lint, type check, testes e build em cada PR
- **Deploy Staging:** Deploy automático para ambiente de staging
- **Deploy Production:** Deploy manual para produção

**📖 Documentação completa:** [Guia CI/CD e DevOps](./docs/guia-ci-cd-devops.md)

---

## RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar
- [x] Deve ser possível se autenticar
- [x] Deve ser possível obter o perfil de um usuário logado
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [ ] Deve ser possível o usuário obter seu histórico de check-ins
- [ ] Deve ser possível o usuário buscar academias próximas
- [ ] Deve ser possível o usuário buscar academias pelo nome
- [ ] Deve ser possível o usuário realizar check-in em uma academia
- [ ] Deve ser possível o usuário validar o check-in de um usuário
- [ ] Deve ser possível o usuário cadastrar uma academia

## RNs (Regras de Negócio)

- [x] O usuário não pode se cadastrar com um email duplicado
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia
- [ ] O check-in só pode ser validado até 20 minutos após criados
- [ ] O check-in só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos Não Funcionais)

- [x] A senha do usuário precisa estar criptografada (Argon2)
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [x] Todas as listas de dados precisam estar paginadas
- [x] O usuário deve ser identificado por um JWT (JSON Web Token)
- [x] Rate limiting implementado
- [x] CORS configurado
- [x] Headers de segurança (Helmet)
- [x] Health check endpoint
- [x] Monitoramento básico

---

## Contribuindo

Este é um projeto experimental. Para contribuir:

1. Leia a [documentação completa](./docs/)
2. Siga os [padrões de código](./docs/) estabelecidos
3. Escreva testes para novas funcionalidades
4. Mantenha a cobertura de testes acima de 80%

---

## Licença

Este projeto é experimental e serve como base para um boilerplate futuro.

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
