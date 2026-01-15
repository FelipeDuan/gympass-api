# 🏗️ ARQUITETURA DEFINITIVA - BOILERPLATE BACKEND OFICIAL

**Data:** Janeiro 2025  
**Autor:** Principal Software Architect & Staff Engineer  
**Objetivo:** Documento arquitetural definitivo para criação do boilerplate backend oficial  
**Status:** Documento Fundacional - Base para Novo Repositório

---

## 📋 ÍNDICE EXECUTIVO

1. [Declaração de Propósito](#declaração-de-propósito)
2. [Avaliação Crítica do Laboratório](#avaliação-crítica-do-laboratório)
3. [Filosofia Arquitetural](#filosofia-arquitetural)
4. [Arquitetura do Boilerplate Oficial](#arquitetura-do-boilerplate-oficial)
5. [Estrutura de Pastas Definitiva](#estrutura-de-pastas-definitiva)
6. [Padrões e Abstrações](#padrões-e-abstrações)
7. [Stack Tecnológica Recomendada](#stack-tecnológica-recomendada)
8. [Configuração de Ambientes](#configuração-de-ambientes)
9. [Estratégia de Testes](#estratégia-de-testes)
10. [Developer Experience (DX)](#developer-experience-dx)
11. [Decisões Arquiteturais Críticas](#decisões-arquiteturais-críticas)
12. [Checklist de Implementação](#checklist-de-implementação)

---

## DECLARAÇÃO DE PROPÓSITO

### O Que Este Documento É

Este documento é a **"bíblia arquitetural"** para a criação de um **boilerplate backend oficial** que será:

- ✅ **Usado em produção** por múltiplos projetos
- ✅ **Base para sistemas grandes** e críticos
- ✅ **Mantido por diferentes times** ao longo de anos
- ✅ **Escalável** sem degradação arquitetural
- ✅ **Focado em infraestrutura**, não em regras de negócio específicas

### O Que Este Documento NÃO É

- ❌ **Não é um guia de implementação** de features específicas
- ❌ **Não é um tutorial** de como usar o boilerplate
- ❌ **Não é um documento de decisões** do laboratório (isso já existe)

### Como Usar Este Documento

1. **Leia completamente** antes de criar o novo repositório
2. **Use como referência** durante toda a implementação
3. **Consulte** quando precisar tomar decisões arquiteturais
4. **Atualize** quando padrões evoluírem (com cuidado)

---

## AVALIAÇÃO CRÍTICA DO LABORATÓRIO

### Resumo Executivo da Avaliação

**Maturidade Atual:** 6.5/10 - **Boa base, mas precisa refinamento crítico**

**Veredicto Final:**
- ✅ **Boa base técnica** - Stack moderna, padrões sólidos
- ✅ **Separação de responsabilidades** - Bem implementada
- ✅ **Dependency Injection** - Funcional, mas pode melhorar
- 🔴 **Estrutura de pastas** - Confusa, arquivos distantes
- 🔴 **Fluxo implícito** - Não documentado, difícil de entender
- 🟡 **Overengineering** - Algumas abstrações desnecessárias
- 🟡 **Testes lentos** - Isolamento excessivo causa overhead

**Decisão:** **NÃO usar laboratório como base direta**. Criar novo repositório do zero seguendo este documento.

---

### 1. AVALIAÇÃO HISTÓRICA DAS DECISÕES

#### ✅ Decisões que Funcionaram Bem

**1.1. Dependency Injection via Factory**

**Decisão:** Criar `createServices()` factory que centraliza criação de dependências.

**Análise:**
- ✅ **Funciona bem** - Centraliza criação, resolve ordem de dependências
- ✅ **Facilita testes** - Permite injetar mocks facilmente
- ✅ **Type-safe** - TypeScript garante tipos corretos
- ⚠️ **Mas pode melhorar** - Factory manual pode ser verboso

**Veredicto:** **REAPROVEITAR** com melhorias (ver seção de Padrões).

---

**1.2. Separação por Módulos (Feature-Based)**

**Decisão:** Organizar código por módulos de domínio (`modules/auth`, `modules/users`).

**Análise:**
- ✅ **Funciona bem** - Cada módulo é independente
- ✅ **Fácil de entender** - Responsabilidades claras
- ✅ **Escalável** - Fácil adicionar novos módulos
- ⚠️ **Mas estrutura interna inconsistente** - Alguns têm DTOs, outros não

**Veredicto:** **REAPROVEITAR** mas padronizar estrutura interna.

---

**1.3. Interfaces em `core/interfaces/`**

**Decisão:** Centralizar interfaces compartilhadas em `core/interfaces/`.

**Análise:**
- ✅ **Funciona bem** - Centraliza contratos
- ✅ **Facilita troca de implementações** - Dependency Inversion
- ⚠️ **Mas cria distância** - Interfaces distantes de implementações
- ⚠️ **Mas pode ser overengineering** - Algumas interfaces não têm múltiplas implementações

**Veredicto:** **REAPROVEITAR** mas ser mais seletivo sobre quais interfaces criar.

---

**1.4. Services como Classes com DI**

**Decisão:** Converter services de objetos para classes com Dependency Injection.

**Análise:**
- ✅ **Funciona bem** - DI claro via construtor
- ✅ **Fácil de testar** - Mock de dependências simples
- ✅ **Type-safe** - TypeScript garante tipos
- ✅ **Padrão consistente** - Todos os services seguem mesmo padrão

**Veredicto:** **REAPROVEITAR** - Esta é uma das melhores decisões.

---

**1.5. Validação com Zod**

**Decisão:** Usar Zod para validação de entrada integrado ao Fastify.

**Análise:**
- ✅ **Funciona muito bem** - Type-safe validation
- ✅ **Integração perfeita** - `fastify-type-provider-zod` funciona bem
- ✅ **Schemas reutilizáveis** - Fácil criar schemas base
- ✅ **Documentação automática** - Swagger gerado automaticamente

**Veredicto:** **REAPROVEITAR** - Excelente escolha.

---

#### ❌ Decisões que Precisam Revisão Crítica

**1.6. Estrutura de Pastas Confusa**

**Decisão:** Separar por camadas (`http/`, `infrastructure/`, `modules/`, `core/`).

**Problemas Identificados:**
- ❌ **Arquivos relacionados distantes** - Middlewares em `http/`, rotas em `modules/`
- ❌ **Fluxo não claro** - Difícil entender como request vira response
- ❌ **Distância lógica** - Services não estão próximos dos repositories que usam
- ❌ **Confusão de responsabilidades** - `health` e `monitoring` em `modules/` mas são infraestrutura

**Por Que Deu Errado:**
- Separação por camada técnica em vez de por domínio
- Foco em "camadas" em vez de "fluxo"
- Não considerou proximidade lógica

**Veredicto:** **DESCARTAR** - Nova estrutura proposta (ver seção de Estrutura).

---

**1.7. Isolamento Excessivo de Testes**

**Decisão:** Criar instância completa do Fastify para cada teste (`buildTestApp()`).

**Problemas Identificados:**
- ❌ **Muito lento** - 30-60s para 107 testes
- ❌ **Overhead desnecessário** - Testes unitários não precisam de Fastify completo
- ❌ **Limpa banco antes de cada teste** - Mesmo para testes que não usam banco
- ❌ **Registra todos os plugins** - Helmet, CORS, Swagger não são necessários para testes unitários

**Por Que Deu Errado:**
- Confusão entre isolamento e overhead
- Não diferenciou tipos de teste (unit vs integration vs E2E)
- Priorizou isolamento total sobre performance

**Veredicto:** **DESCARTAR** - Nova estratégia proposta (ver seção de Testes).

---

**1.8. Circuit Breaker Não Usado**

**Decisão:** Implementar Circuit Breaker completo mas não usar.

**Problemas Identificados:**
- ❌ **Código morto** - Implementado mas não usado
- ❌ **Overengineering** - Abstração criada "por precaução"
- ❌ **Complexidade desnecessária** - Adiciona código sem valor

**Por Que Deu Errado:**
- YAGNI violado - Criou abstração antes de necessidade
- "Pode ser útil no futuro" não é justificativa suficiente

**Veredicto:** **DESCARTAR** - Remover ou documentar quando usar.

---

**1.9. Logger Adapter Desnecessário**

**Decisão:** Criar `FastifyLoggerAdapter` para adaptar Fastify logger para interface genérica.

**Problemas Identificados:**
- ⚠️ **Camada extra** - Adiciona complexidade sem benefício claro
- ⚠️ **Não vai trocar logger** - Fastify logger já é excelente
- ⚠️ **Overengineering** - Abstração criada "por precaução"

**Por Que Deu Errado:**
- Assumiu que logger seria trocado (não vai)
- Criou abstração sem necessidade real

**Veredicto:** **DESCARTAR** - Usar Fastify logger diretamente.

---

**1.10. Health e Monitoring em `modules/`**

**Decisão:** Colocar `health` e `monitoring` em `modules/` como se fossem domínio.

**Problemas Identificados:**
- ❌ **Não são domínio** - São infraestrutura técnica
- ❌ **Confusão conceitual** - Mistura domínio com infraestrutura
- ❌ **Estrutura inconsistente** - Outras infraestruturas estão em `infrastructure/`

**Por Que Deu Errado:**
- Não diferenciou domínio de infraestrutura
- Focou em "tem rotas HTTP" em vez de "é regra de negócio?"

**Veredicto:** **DESCARTAR** - Mover para `infrastructure/`.

---

### 2. ANÁLISE DE COMO A APLICAÇÃO ESCALOU

#### 2.1 Crescimento Estrutural

**Fase Inicial (Boa):**
- Estrutura simples e clara
- Poucos módulos
- Fácil de entender

**Fase Intermediária (Começou a Entortar):**
- Adicionou `health` e `monitoring` em `modules/`
- Criou abstrações "por precaução"
- Estrutura começou a ficar confusa

**Fase Atual (Problemas Críticos):**
- Arquivos relacionados distantes
- Fluxo não documentado
- Testes lentos
- Overengineering em alguns pontos

**Por Que Começou a Se Perder:**

1. **Falta de Visão Arquitetural Clara**
   - Decisões tomadas incrementalmente sem visão geral
   - Não havia documento arquitetural definitivo
   - Cada decisão feita isoladamente

2. **Confusão Entre Domínio e Infraestrutura**
   - Não diferenciou claramente o que é domínio do que é infraestrutura
   - Health e monitoring tratados como domínio

3. **Priorização de Isolamento sobre Performance**
   - Testes isolados mas muito lentos
   - Não diferenciou tipos de teste

4. **YAGNI Violado**
   - Criou abstrações antes de necessidade
   - Circuit breaker não usado
   - Logger adapter desnecessário

---

#### 2.2 Acoplamentos Identificados

**Acoplamento Alto (Problema):**
- `users.service.ts` depende de múltiplas coisas (`ICacheService`, `IUsersRepository`, constantes, erros)
- **Mas isso é aceitável** - Service orquestra, é normal depender de várias coisas

**Acoplamento Médio (Aceitável):**
- `auth.service.ts` depende de `users.service.ts` via interface
- **Bom** - Dependency Inversion respeitado

**Acoplamento Baixo (Ideal):**
- `users.repository.ts` depende apenas de Prisma
- **Ideal** - Repository isolado

**Conclusão:** Acoplamentos estão bem gerenciados. O problema não é acoplamento, é **distância física** entre arquivos relacionados.

---

#### 2.3 Onde a Arquitetura "Entortou"

**Ponto de Virada 1: Health e Monitoring**
- Quando foram adicionados em `modules/`, começou confusão
- Não ficou claro o que é domínio vs infraestrutura

**Ponto de Virada 2: Testes Lentos**
- Quando `buildTestApp()` foi criado, testes ficaram lentos
- Isolamento excessivo causou overhead

**Ponto de Virada 3: Abstrações Não Usadas**
- Circuit breaker e logger adapter criados mas não usados
- Começou a ter código morto

**Lições Aprendidas:**
1. **Documentar decisões arquiteturais** antes de implementar
2. **Diferenciar domínio de infraestrutura** claramente
3. **Não criar abstrações** sem necessidade real
4. **Priorizar performance** junto com isolamento em testes

---

## FILOSOFIA ARQUITETURAL

### Princípios Fundamentais (Não Negociáveis)

#### 1. Clareza > Inteligência

**O que significa:**
- Código explícito, não implícito
- Fluxos claros e documentados
- Pouca mágica, muita explicitação
- Fácil de entender sem contexto prévio

**Como aplicar:**
- Documentar fluxos importantes
- Nomes descritivos
- Estrutura que reflete o fluxo
- Comentários quando necessário

---

#### 2. Proximidade Lógica

**O que significa:**
- Arquivos que trabalham juntos devem estar próximos
- Reduzir "saltos mentais" entre arquivos relacionados
- Estrutura facilita entendimento

**Como aplicar:**
- Agrupar por domínio, não por camada técnica
- Middlewares próximos das rotas que usam (quando específicos)
- Services próximos dos repositories que usam

---

#### 3. Pragmatismo sobre Perfeição

**O que significa:**
- Criar abstrações apenas quando necessário
- Evitar overengineering
- Priorizar simplicidade quando possível
- YAGNI (You Aren't Gonna Need It)

**Como aplicar:**
- Não criar interface se não há múltiplas implementações
- Não criar abstração "por precaução"
- Remover código não usado
- Validar necessidade antes de criar abstração

---

#### 4. Escalabilidade Real

**O que significa:**
- Escalar pessoas (fácil de entender e manter)
- Escalar manutenção (padrões claros)
- Escalar domínio (fácil adicionar módulos)
- Escalar performance (otimizações quando necessário)

**Como aplicar:**
- Padrões claros e documentados
- Estrutura previsível
- Testes rápidos
- Performance otimizada quando necessário

---

#### 5. Developer Experience como Cidadão de Primeira Classe

**O que significa:**
- Desenvolvedor deve focar em regra de negócio
- Infra, validação, erro, logging, cache devem ser padrão
- Onboarding rápido
- Desenvolvimento de módulos simples

**Como aplicar:**
- Padrões claros e previsíveis
- Documentação completa
- Exemplos práticos
- Templates e generators (futuro)

---

### O Que Explicitamente NÃO Será Feito

#### ❌ Overengineering

**Não faremos:**
- Abstrações sem necessidade real
- Interfaces para coisas que não vão ter múltiplas implementações
- Padrões complexos quando simples funcionam
- Código "por precaução"

**Exemplos do que NÃO fazer:**
- `IStringUtils` - Não há múltiplas implementações
- `IArgon2Service` - Sempre será Argon2
- Circuit Breaker antes de precisar

---

#### ❌ Separação Excessiva por Camadas Técnicas

**Não faremos:**
- Separar tudo por camada técnica (`http/`, `services/`, `repositories/`)
- Criar distância entre arquivos relacionados
- Priorizar "camadas" sobre "fluxo"

**Exemplos do que NÃO fazer:**
- Todos os middlewares em `http/middlewares/` mesmo sendo específicos de módulo
- Services distantes dos repositories que usam
- Rotas distantes dos handlers

---

#### ❌ Testes Lentos "por Isolamento"

**Não faremos:**
- Criar instância completa do Fastify para testes unitários
- Limpar banco antes de cada teste unitário
- Registrar todos os plugins para testes unitários

**Exemplos do que NÃO fazer:**
- `buildTestApp()` para testes unitários
- `cleanDatabase()` antes de cada teste unitário
- Testes sequenciais quando podem ser paralelos

---

#### ❌ Código Morto

**Não faremos:**
- Manter código não usado
- Abstrações criadas mas não utilizadas
- Features implementadas mas não usadas

**Exemplos do que NÃO fazer:**
- Circuit Breaker não usado
- Logger adapter não necessário
- Abstrações "por precaução"

---

## ARQUITETURA DO BOILERPLATE OFICIAL

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              PLUGINS GLOBAIS (Fastify)                      │
│  • Helmet (Segurança)                                       │
│  • CORS                                                     │
│  • Rate Limit                                              │
│  • JWT                                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ROTEAMENTO (routes.config.ts)                  │
│  • Registra todas as rotas                                 │
│  • Hooks globais (onRequest, onResponse)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VALIDAÇÃO (Zod via Fastify)                    │
│  • Valida body, query, params                              │
│  • Retorna 400 se inválido                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              MIDDLEWARES (preHandler)                       │
│  • authenticate (JWT)                                       │
│  • authorize (RBAC)                                        │
│  • tenant-resolver (Multi-tenancy)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              HANDLER DA ROTA                               │
│  • Extrai dados (query, params, body)                     │
│  • Chama service                                           │
│  • Retorna resposta                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVICE (Lógica de Negócio)                     │
│  • Valida regras de negócio                                │
│  • Orquestra repositories                                  │
│  • Gerencia cache                                          │
│  • Lança erros customizados                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              REPOSITORY (Acesso a Dados)                    │
│  • Queries Prisma                                          │
│  • Retorna DTOs tipados                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              PRISMA (ORM)                                   │
│  • Executa queries SQL                                     │
│  • Retorna dados tipados                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              SERIALIZER (Formatação)                        │
│  • Converte tipos (Date → string)                         │
│  • Remove campos sensíveis                                 │
│  • Formata estrutura                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    HTTP RESPONSE                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Fluxo Detalhado: Request → Response

#### Exemplo: `GET /users?page=1&limit=10` (Autenticado)

**1. Request HTTP chega**
- Arquivo: `src/server.ts`
- Fastify recebe request

**2. Plugins Globais Aplicados**
- Arquivo: `src/config/plugins/`
- Helmet adiciona headers de segurança
- CORS valida origin
- Rate Limit verifica limites
- JWT preparado (mas não validado ainda)

**3. Roteamento**
- Arquivo: `src/config/plugins/routes.config.ts`
- `onRequest` hook registra tempo de início
- Rota `/users` encontrada

**4. Validação de Schema**
- Arquivo: `src/modules/users/users.schemas.ts`
- `listUsersSchema` valida `page` e `limit`
- Se inválido, retorna 400

**5. Middlewares (`preHandler`)**
- Arquivo: `src/http/middlewares/authenticate.ts`
- Verifica JWT no header `Authorization`
- Se inválido, lança `UnauthorizedError` (401)
- Arquivo: `src/http/middlewares/authorize.ts`
- Verifica se `request.user.role` está em `['ADMIN', 'USER']`
- Se não, lança `ForbiddenError` (403)
- Arquivo: `src/http/middlewares/tenant-resolver.ts` (novo)
- Resolve tenant do request
- Adiciona `request.tenant` ao contexto

**6. Handler da Rota**
- Arquivo: `src/modules/users/users.routes.ts`
- Extrai `page` e `limit` de `request.query`
- Chama `usersService.findAll(page, limit)`

**7. Service (Lógica de Negócio)**
- Arquivo: `src/modules/users/users.service.ts`
- Tenta buscar no cache: `cache.get('users:list:page:1:limit:10')`
- Se não houver cache:
  - Calcula `skip = (page - 1) * limit`
  - Chama `usersRepository.findAll(skip, limit)` e `usersRepository.count()`
  - Serializa: `serializeUsersPage(data, page, total)`
  - Armazena no cache: `cache.set(key, result, TTL)`
- Retorna resultado

**8. Repository (Acesso a Dados)**
- Arquivo: `src/modules/users/users.repository.ts`
- Executa query Prisma: `prisma.user.findMany({ skip, take, select: userSelect })`
- Retorna `UserDTO[]`

**9. Prisma (ORM)**
- Arquivo: `src/infrastructure/database/prisma.ts`
- Executa query SQL no PostgreSQL
- Retorna dados tipados

**10. Serializer (Formatação)**
- Arquivo: `src/modules/users/users.serializers.ts`
- Converte `Date` para ISO string
- Formata estrutura paginada
- Retorna formato da API

**11. Error Handler (Se Houver Erro)**
- Arquivo: `src/http/error-handler.ts`
- Captura qualquer erro lançado
- Formata resposta de erro consistente
- Loga erro (com correlation ID)

**12. Response HTTP**
- Fastify envia resposta
- `onResponse` hook registra métricas
- Response enviada ao cliente

---

### Multi-Tenancy desde o Início

#### Por Que Multi-Tenancy?

**Requisito do Boilerplate:**
- Boilerplate será usado por múltiplos projetos
- Alguns projetos precisarão multi-tenancy
- Melhor implementar desde o início do que depois

**Como Implementar:**

**1. Tenant Resolution Middleware**
```typescript
// src/http/middlewares/tenant-resolver.ts
export async function tenantResolver(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // Opção 1: Header X-Tenant-ID
  const tenantId = request.headers['x-tenant-id'];
  
  // Opção 2: Subdomain
  const host = request.headers.host;
  const tenantId = extractTenantFromHost(host);
  
  // Opção 3: JWT claim
  const tenantId = request.user?.tenantId;
  
  if (!tenantId) {
    throw new UnauthorizedError('Tenant ID required.');
  }
  
  request.tenant = { id: tenantId };
}
```

**2. Prisma Schema com Tenant**
```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  created_at DateTime @default(now())
  
  users User[]
  
  @@map("organizations")
}

model User {
  id             String       @id @default(uuid())
  organization_id String
  organization   Organization @relation(fields: [organization_id], references: [id])
  // ... outros campos
  
  @@index([organization_id])
  @@map("users")
}
```

**3. Repository com Tenant Context**
```typescript
// src/modules/users/users.repository.ts
export function createUsersRepository(prisma: PrismaClient) {
  return {
    async findAll(
      tenantId: string,
      skip: number,
      take: number,
    ): Promise<UserDTO[]> {
      return await prisma.user.findMany({
        where: { organization_id: tenantId },
        skip,
        take,
        select: userSelect,
      });
    },
  };
}
```

**4. Service com Tenant**
```typescript
// src/modules/users/users.service.ts
export class UsersService {
  async findAll(
    tenantId: string,
    page: number,
    limit: number,
  ) {
    // Usa tenantId em queries
    const data = await this.repository.findAll(tenantId, skip, limit);
    // ...
  }
}
```

**5. Rota com Tenant**
```typescript
// src/modules/users/users.routes.ts
app.get(
  '/',
  {
    preHandler: [authenticate, authorize(['ADMIN', 'USER']), tenantResolver],
  },
  async (request, reply) => {
    const tenant = request.tenant; // Adicionado pelo middleware
    const result = await usersService.findAll(tenant.id, request.query);
    return reply.send(result);
  },
);
```

---

## ESTRUTURA DE PASTAS DEFINITIVA

### Estrutura Proposta

```
src/
├── config/                          # Configurações globais
│   ├── app.ts                       # Instância Fastify
│   ├── env.ts                       # Validação de variáveis de ambiente
│   ├── jwt.ts                       # Config JWT
│   ├── rate-limit.ts                # Config rate limit
│   └── plugins/                     # Plugins do Fastify
│       ├── cors.config.ts
│       ├── helmet.config.ts
│       ├── rate-limit.config.ts
│       ├── routes.config.ts
│       └── swagger.config.ts
│
├── shared/                          # Utilitários compartilhados
│   ├── constants.ts                 # Constantes globais
│   ├── types/                       # Tipos TypeScript compartilhados
│   └── utils/                       # Funções utilitárias
│       └── paginations.ts
│
├── infrastructure/                  # Infraestrutura técnica
│   ├── cache/                       # Cache (Redis)
│   │   ├── cache-service.ts
│   │   └── redis.ts
│   ├── database/                    # Banco de dados (Prisma)
│   │   └── prisma.ts
│   ├── logger/                      # Logger
│   │   └── logger.ts                # Usa Fastify logger diretamente
│   ├── health/                      # Health check endpoint
│   │   ├── health.routes.ts
│   │   ├── health.service.ts
│   │   └── health.schemas.ts
│   └── monitoring-endpoint/         # Endpoint de métricas
│       ├── monitoring.routes.ts
│       ├── monitoring.service.ts
│       └── monitoring.schemas.ts
│
├── http/                            # Camada HTTP genérica
│   ├── errors/                      # Erros HTTP customizados
│   │   └── app-error.ts
│   ├── middlewares/                 # Middlewares genéricos
│   │   ├── authenticate.ts          # Autenticação (genérico)
│   │   ├── authorize.ts             # Autorização (genérico)
│   │   ├── tenant-resolver.ts       # Resolução de tenant (novo)
│   │   └── index.ts
│   └── error-handler.ts             # Error handler global
│
├── core/                            # Lógica core compartilhada
│   ├── di/                          # Dependency Injection
│   │   └── service-factory.ts
│   └── interfaces/                  # Interfaces compartilhadas
│       ├── cache.interface.ts
│       ├── token.interface.ts
│       ├── users.repository.interface.ts
│       └── users.service.interface.ts
│
└── modules/                         # Módulos de domínio
    ├── auth/                        # Autenticação (domínio)
    │   ├── auth.routes.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   ├── auth.schemas.ts
    │   └── __tests__/
    │       ├── unit/
    │       └── integration/
    │
    ├── users/                       # Usuários (domínio)
    │   ├── users.routes.ts
    │   ├── users.service.ts
    │   ├── users.repository.ts
    │   ├── users.schemas.ts
    │   ├── users.dto.ts
    │   ├── users.serializers.ts
    │   └── __tests__/
    │       ├── unit/
    │       └── integration/
    │
    └── organizations/               # Organizações (domínio, novo)
        ├── organizations.routes.ts
        ├── organizations.service.ts
        ├── organizations.repository.ts
        ├── organizations.schemas.ts
        ├── organizations.dto.ts
        ├── organizations.serializers.ts
        └── __tests__/
            ├── unit/
            └── integration/
```

---

### Justificativas das Decisões

#### Por Que Esta Estrutura?

**1. Agrupamento por Domínio (Não por Camada Técnica)**

**Vantagens:**
- ✅ Arquivos relacionados próximos
- ✅ Fluxo mais claro
- ✅ Fácil adicionar novos módulos
- ✅ Reduz "saltos mentais"

**Exemplo:**
```
modules/users/
├── users.routes.ts      ← Rota
├── users.service.ts     ← Service (usa repository abaixo)
├── users.repository.ts  ← Repository (próximo do service que usa)
├── users.schemas.ts     ← Schemas (usados pela rota acima)
└── users.dto.ts         ← DTOs (usados pelo repository acima)
```

**Tudo relacionado a `users` está junto!**

---

**2. Middlewares Genéricos em `http/middlewares/`**

**Por quê:**
- Middlewares `authenticate` e `authorize` são genéricos (usados por múltiplos módulos)
- Não faz sentido duplicar em cada módulo
- Mas middlewares específicos de módulo podem ficar no módulo

**Exemplo:**
- `authenticate` → `http/middlewares/` (genérico)
- `checkUserOwnership` → `modules/users/middlewares/` (específico)

---

**3. Infraestrutura Separada**

**Por quê:**
- Health e monitoring são infraestrutura técnica, não domínio
- Devem estar em `infrastructure/` junto com cache, database, logger
- Não são regras de negócio

---

**4. Core Apenas para Compartilhado**

**Por quê:**
- `core/` deve ter apenas coisas realmente compartilhadas
- Interfaces compartilhadas (usadas por múltiplos módulos)
- DI factory (cria serviços compartilhados)
- Não deve ter implementações concretas (isso é `infrastructure/`)

---

### Regras de Dependência

```
modules/ → pode depender de → core/, http/errors, shared/, types/
modules/ → NÃO PODE depender de → infrastructure/, config/

infrastructure/ → pode depender de → core/interfaces, config/, shared/, types/
infrastructure/ → NÃO PODE depender de → modules/

http/ → pode depender de → modules/, core/, shared/, types/
http/ → NÃO PODE depender de → infrastructure/ diretamente

core/ → pode depender de → shared/, types/
core/ → NÃO PODE depender de → modules/, infrastructure/, http/

shared/ → pode depender de → types/
shared/ → NÃO PODE depender de → modules/, infrastructure/, http/, core/
```

**Por Que Estas Regras?**

- **Módulos não conhecem infraestrutura** - Dependency Inversion
- **Infraestrutura não conhece módulos** - Separação de responsabilidades
- **Core é compartilhado** - Não depende de nada específico
- **Shared é utilitário** - Não depende de nada de negócio

---

## PADRÕES E ABSTRAÇÕES

### Quando Criar Interface?

**✅ SIM, criar interface quando:**
- Há múltiplas implementações possíveis (ex: Redis cache vs Memória cache)
- Precisa mockar em testes (ex: `IUsersRepository`)
- Quer desacoplar de infraestrutura específica (ex: `ITokenService`)
- Facilita reutilização (ex: `ICacheService`)

**❌ NÃO criar interface quando:**
- Há apenas uma implementação e não vai mudar (ex: Argon2)
- Abstração não traz benefício real
- Adiciona complexidade sem valor
- É "porque é bonito" sem necessidade prática

**Exemplos Práticos:**

✅ **BOM:** `ICacheService` - Pode ter Redis, Memória, Memcached  
✅ **BOM:** `ITokenService` - Pode ter JWT, OAuth, outros  
✅ **BOM:** `IUsersRepository` - Facilita testes, pode ter múltiplas implementações

❌ **RUIM:** `IArgon2Service` - Sempre será Argon2, não precisa abstrair  
❌ **RUIM:** `IStringUtils` - Não há múltiplas implementações  
❌ **RUIM:** `ILogger` (se não vai trocar) - Fastify logger já é excelente

---

### Quando Usar Classes vs Objetos vs Funções?

**Classes:**
- ✅ Services (precisam DI via construtor)
- ✅ Repositories (quando precisam estado)
- ✅ Quando precisa herança (raro)

**Objetos Literais:**
- ✅ Configurações
- ✅ Constantes
- ✅ Quando não precisa DI

**Funções:**
- ✅ Utilitários puros
- ✅ Factories
- ✅ Helpers

**Exemplos:**

```typescript
// ✅ Classe - Service precisa DI
export class UsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}
}

// ✅ Objeto Literal - Configuração
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};

// ✅ Função - Factory
export function createUsersRepository(prisma: PrismaClient) {
  return { /* ... */ };
}

// ✅ Função - Utilitário puro
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
```

---

### Padrão de Módulo Completo

**Estrutura Mínima Obrigatória:**

```
modules/{module}/
├── {module}.routes.ts      # ✅ Obrigatório
├── {module}.service.ts     # ✅ Obrigatório
├── {module}.repository.ts  # ✅ Obrigatório
├── {module}.schemas.ts     # ✅ Obrigatório
├── {module}.dto.ts         # ⚠️ Opcional (quando necessário)
├── {module}.serializers.ts # ⚠️ Opcional (quando necessário)
└── __tests__/              # ✅ Obrigatório
    ├── unit/
    └── integration/
```

**Quando Usar DTOs?**
- Quando precisa seleção específica de campos do Prisma
- Quando quer garantir type safety na seleção
- Quando não quer retornar todos os campos do modelo

**Quando Usar Serializers?**
- Quando precisa formatar dados (Date → string)
- Quando precisa remover campos sensíveis
- Quando precisa transformar estrutura

**Exemplo Completo:**

```typescript
// users.routes.ts
export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  const { usersService } = app.services;
  
  app.get(
    '/',
    {
      schema: listUsersSchema,
      preHandler: [authenticate, authorize(['ADMIN', 'USER']), tenantResolver],
    },
    async (request, reply) => {
      const tenant = request.tenant;
      const result = await usersService.findAll(tenant.id, request.query);
      return reply.send(result);
    },
  );
};

// users.service.ts
export class UsersService implements IUsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}
  
  async findAll(tenantId: string, page: number, limit: number) {
    // Lógica de negócio
  }
}

// users.repository.ts
export function createUsersRepository(prisma: PrismaClient) {
  return {
    async findAll(tenantId: string, skip: number, take: number) {
      return await prisma.user.findMany({
        where: { organization_id: tenantId },
        skip,
        take,
        select: userSelect,
      });
    },
  };
}
```

---

## STACK TECNOLÓGICA RECOMENDADA

### Stack Principal (Confirmada)

**Runtime:** Node.js 22.x (LTS)
- ✅ Performance excelente
- ✅ Suporte longo prazo
- ✅ Ecossistema maduro

**Linguagem:** TypeScript 5.9+ (strict mode)
- ✅ Type safety
- ✅ Documentação via tipos
- ✅ Refatorações seguras

**Framework:** Fastify 5.x
- ✅ Performance-first
- ✅ Plugin system excelente
- ✅ Type-safe com `fastify-type-provider-zod`

**ORM:** Prisma 7.x
- ✅ Type-safe queries
- ✅ Migrations automáticas
- ✅ Excelente DX

**Banco:** PostgreSQL 17
- ✅ Robusto e confiável
- ✅ Suporte a multi-tenancy
- ✅ Performance excelente

**Cache:** Redis 7
- ✅ Performance excelente
- ✅ Suporte a TTL
- ✅ Padrão da indústria

**Validação:** Zod 4.x
- ✅ Type-safe validation
- ✅ Integração perfeita com Fastify
- ✅ Schemas reutilizáveis

**Testes:** Vitest 4.x
- ✅ Rápido e moderno
- ✅ Compatível com Jest
- ✅ Suporte a ESM

**Linting:** Biome 2.x
- ✅ Rápido
- ✅ Formatação + linting
- ✅ Zero configuração

---

### Plugins Fastify Recomendados

**Obrigatórios:**
- `@fastify/jwt` - Autenticação JWT
- `@fastify/helmet` - Headers de segurança
- `@fastify/cors` - CORS
- `@fastify/rate-limit` - Rate limiting
- `@fastify/swagger` + `@scalar/fastify-api-reference` - Documentação API
- `fastify-type-provider-zod` - Validação type-safe

**Opcionais (Futuro):**
- `@fastify/compress` - Compressão (gzip/brotli)
- `@fastify/request-context` - Request context (para correlation IDs)
- `@fastify/multipart` - Upload de arquivos (se necessário)

---

### Bibliotecas Auxiliares

**Obrigatórias:**
- `argon2` - Hash de senhas
- `ioredis` - Cliente Redis
- `pg` + `@prisma/adapter-pg` - Driver PostgreSQL para Prisma
- `dotenv` - Variáveis de ambiente

**Opcionais (Futuro):**
- `pino` - Logger estruturado (se não usar Fastify logger)
- `zod` - Já incluído, mas mencionar novamente

---

### Ferramentas de Desenvolvimento

**Obrigatórias:**
- `tsx` - Executar TypeScript diretamente
- `tsup` - Build otimizado
- `vitest` - Testes
- `@biomejs/biome` - Linting e formatação
- `prisma` - ORM e migrations
- `husky` + `lint-staged` - Pre-commit hooks

**Opcionais:**
- `pino-pretty` - Formatação de logs em dev
- `dotenv-cli` - Gerenciar .env files

---

## CONFIGURAÇÃO DE AMBIENTES

### Ambientes Definidos

**1. `dev` (Desenvolvimento)**
- Logs detalhados
- Swagger habilitado
- Rate limit relaxado
- CORS permissivo
- Hot reload

**2. `test` (Testes)**
- Logs desabilitados
- Banco de dados isolado
- Cache mockado (opcional)
- Testes rápidos

**3. `production` (Produção)**
- Logs estruturados
- Swagger desabilitado (ou protegido)
- Rate limit rigoroso
- CORS restritivo
- Performance otimizada

---

### Variáveis de Ambiente

**Obrigatórias:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**Opcionais (com defaults):**
```env
NODE_ENV=dev
PORT=3100
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_EXPIRES_IN=7d
CORS_ORIGINS=*
```

**Multi-Tenancy (Futuro):**
```env
TENANT_RESOLUTION_MODE=header|subdomain|jwt
DEFAULT_TENANT_ID=default-org-id
```

---

### Comportamento por Ambiente

**Dev:**
- Logs coloridos e formatados (`pino-pretty`)
- Swagger em `/docs`
- Rate limit: 1000 req/min
- CORS: `localhost:*`
- Hot reload habilitado

**Test:**
- Logs desabilitados
- Swagger desabilitado
- Rate limit desabilitado
- CORS desabilitado
- Banco isolado por teste

**Production:**
- Logs estruturados (JSON)
- Swagger desabilitado ou protegido
- Rate limit: 50 req/min (global), 5 req/min (auth)
- CORS: Lista específica de origins
- Performance otimizada

---

## ESTRATÉGIA DE TESTES

### Filosofia de Testes

**Princípios:**
1. **Testes existem para validar comportamento**, não arquitetura
2. **Performance importa** - Testes devem ser rápidos
3. **Isolamento quando necessário** - Mas não a qualquer custo
4. **Tipos diferentes de teste** - Unit, Integration, E2E

---

### Tipos de Teste

**1. Testes Unitários**
- **O que testar:** Lógica de negócio isolada
- **Dependências:** Mocks
- **Performance:** < 5s para suite completa
- **Isolamento:** Total (mocks)

**2. Testes de Integração**
- **O que testar:** Integração entre camadas (Service + Repository)
- **Dependências:** Banco de dados real (isolado)
- **Performance:** < 10s para suite completa
- **Isolamento:** Por suite (não por teste)

**3. Testes E2E**
- **O que testar:** Fluxos completos (Request → Response)
- **Dependências:** Fastify completo, banco real
- **Performance:** < 20s para suite completa
- **Isolamento:** Por teste (limpar banco entre testes)

---

### Estratégia de Isolamento

**Para Testes Unitários:**
```typescript
// ✅ Usar mocks, não Fastify real
vi.mock('../users.repository');
const mockRepository = {
  findAll: vi.fn(),
};

const service = new UsersService(mockCache, mockRepository);
```

**Para Testes de Integração:**
```typescript
// ✅ Usar Fastify leve, banco isolado
const app = await buildIntegrationApp(); // Sem plugins pesados
const prisma = getTestPrisma(); // Instância isolada
```

**Para Testes E2E:**
```typescript
// ✅ Usar Fastify completo
const app = await buildE2EApp(); // Com todos os plugins
await cleanDatabase(); // Limpar antes de cada teste
```

---

### Helpers de Teste

**buildMockApp()** - Para testes unitários
```typescript
export function buildMockApp() {
  // Mock do Fastify, sem plugins
  return {
    services: {
      usersService: mockUsersService,
    },
  };
}
```

**buildIntegrationApp()** - Para testes de integração
```typescript
export async function buildIntegrationApp() {
  const app = fastify({ logger: false });
  // Apenas plugins essenciais
  await app.register(fastifyJwt, jwtConfig);
  await registerRoutes(app);
  return app;
}
```

**buildE2EApp()** - Para testes E2E
```typescript
export async function buildE2EApp() {
  const app = fastify({ logger: false });
  // Todos os plugins
  await setupPlugins();
  return app;
}
```

---

### O Que Testar e O Que NÃO Testar

**✅ Testar:**
- Lógica de negócio (services)
- Queries complexas (repositories)
- Validações (schemas)
- Fluxos completos (E2E)

**❌ NÃO Testar:**
- Código de framework (Fastify, Prisma)
- Bibliotecas externas (Zod, Argon2)
- Configurações simples
- Código trivial

---

## DEVELOPER EXPERIENCE (DX)

### Padrões de Criação de Módulos

**Template Mental:**
1. Criar estrutura básica (`routes`, `service`, `repository`, `schemas`)
2. Implementar repository primeiro (queries)
3. Implementar service (lógica de negócio)
4. Implementar routes (handlers)
5. Adicionar DTOs e serializers se necessário
6. Escrever testes

**Ordem Recomendada:**
1. Schemas (validação)
2. Repository (dados)
3. Service (negócio)
4. Routes (HTTP)
5. Testes

---

### Convenções Claras

**Nomenclatura:**
- Arquivos: `kebab-case.ts` ou `camelCase.ts` (consistente no módulo)
- Pastas: `kebab-case`
- Classes: `PascalCase`
- Funções: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

**Estrutura:**
- Cada módulo segue mesma estrutura
- Arquivos obrigatórios sempre presentes
- Arquivos opcionais quando necessário

**Padrões:**
- Services sempre classes com DI
- Repositories sempre factories
- Routes sempre plugins Fastify
- Schemas sempre Zod

---

### Onboarding Simples

**Novo desenvolvedor deve:**
1. Ler README (10 min)
2. Ler estrutura de pastas (5 min)
3. Ver exemplo de módulo completo (15 min)
4. Criar primeiro módulo seguindo padrão (30 min)

**Total:** ~1 hora para estar produtivo

---

### Templates e Generators (Futuro)

**Generator de Módulo:**
```bash
pnpm generate:module tasks
```

**Cria:**
- Estrutura completa do módulo
- Arquivos básicos com templates
- Testes básicos
- Registro de rotas

**Templates:**
- Service template
- Repository template
- Routes template
- Test templates

---

## DECISÕES ARQUITETURAIS CRÍTICAS

### 1. Multi-Tenancy desde o Início

**Decisão:** Implementar multi-tenancy desde o início, não depois.

**Por quê:**
- Mais fácil implementar desde o início
- Evita refatoração massiva depois
- Boilerplate será usado por projetos que precisam multi-tenancy

**Como:**
- Tenant resolution middleware
- Prisma schema com `organization_id`
- Repositories recebem `tenantId`
- Services recebem `tenantId`

**Trade-offs:**
- ⚠️ Adiciona complexidade inicial
- ✅ Mas evita refatoração massiva depois
- ✅ Padrão estabelecido desde o início

---

### 2. Services como Classes (Não Objetos)

**Decisão:** Services são classes com DI via construtor, não objetos literais.

**Por quê:**
- DI claro e explícito
- Fácil de testar (mock de dependências)
- Padrão consistente
- Type-safe

**Trade-offs:**
- ⚠️ Mais verboso que objetos
- ✅ Mas mais claro e testável

---

### 3. Repositories como Factories

**Decisão:** Repositories são criados via factory functions, não classes.

**Por quê:**
- Permite injetar Prisma (facilita testes)
- Padrão simples e direto
- Não precisa de classe (não tem estado)

**Trade-offs:**
- ⚠️ Factory manual (mas simples)
- ✅ Flexível para testes

---

### 4. Validação na Camada HTTP (Não no Service)

**Decisão:** Validação acontece na camada HTTP (Zod), não no service.

**Por quê:**
- Validação é responsabilidade da camada HTTP
- Service recebe dados já validados
- Não precisa validar novamente
- Zod integrado ao Fastify funciona bem

**Trade-offs:**
- ⚠️ Service não valida (mas não precisa)
- ✅ Separação clara de responsabilidades

---

### 5. Cache no Service (Não no Repository)

**Decisão:** Cache é gerenciado no service, não no repository.

**Por quê:**
- Cache é estratégia de negócio, não de dados
- Service decide quando cachear
- Repository apenas acessa dados

**Trade-offs:**
- ⚠️ Service conhece cache (mas é necessário)
- ✅ Repository focado apenas em dados

---

### 6. Error Handler Global (Não por Rota)

**Decisão:** Error handler global captura todos os erros, rotas não tratam erros.

**Por quê:**
- Consistência nas respostas de erro
- Não precisa tratar erro em cada rota
- Centraliza lógica de erro

**Trade-offs:**
- ⚠️ Menos controle por rota (mas raramente necessário)
- ✅ Consistência e simplicidade

---

## CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial

- [ ] Criar novo repositório
- [ ] Configurar Node.js 22
- [ ] Configurar TypeScript (strict mode)
- [ ] Configurar Fastify
- [ ] Configurar Prisma
- [ ] Configurar Redis
- [ ] Configurar Zod
- [ ] Configurar Vitest
- [ ] Configurar Biome
- [ ] Configurar Husky + lint-staged

---

### Fase 2: Estrutura Base

- [ ] Criar estrutura de pastas
- [ ] Configurar path aliases (`@/`)
- [ ] Configurar variáveis de ambiente
- [ ] Configurar logger (Fastify)
- [ ] Configurar error handler
- [ ] Configurar plugins (Helmet, CORS, Rate Limit, JWT, Swagger)

---

### Fase 3: Infraestrutura

- [ ] Implementar cache service (Redis)
- [ ] Implementar database (Prisma)
- [ ] Implementar health check
- [ ] Implementar monitoring endpoint
- [ ] Configurar DI factory

---

### Fase 4: Módulos Base

- [ ] Módulo `organizations` (multi-tenancy)
- [ ] Módulo `users` (com tenant)
- [ ] Módulo `auth` (com tenant)

---

### Fase 5: Multi-Tenancy

- [ ] Tenant resolution middleware
- [ ] Prisma schema com `organization_id`
- [ ] Repositories com tenant context
- [ ] Services com tenant context
- [ ] Rotas com tenant resolver

---

### Fase 6: Testes

- [ ] Configurar helpers de teste
- [ ] Testes unitários (mocks)
- [ ] Testes de integração (banco isolado)
- [ ] Testes E2E (Fastify completo)
- [ ] Cobertura mínima 80%

---

### Fase 7: Documentação

- [ ] README completo
- [ ] Documentação de estrutura
- [ ] Documentação de padrões
- [ ] Exemplo completo de módulo
- [ ] Guia de desenvolvimento

---

## CONCLUSÃO

Este documento serve como **base arquitetural definitiva** para a criação do boilerplate backend oficial.

**Principais Decisões:**
1. ✅ Multi-tenancy desde o início
2. ✅ Estrutura por domínio (não por camada técnica)
3. ✅ Services como classes com DI
4. ✅ Repositories como factories
5. ✅ Testes rápidos e isolados adequadamente
6. ✅ Pragmatismo sobre perfeição

**Próximos Passos:**
1. Criar novo repositório
2. Seguir este documento passo a passo
3. Implementar fase por fase
4. Validar cada fase antes de prosseguir

**Este boilerplate não é um experimento. É uma fundação. Ele precisa nascer certo.**

---

**Documento criado em:** Janeiro 2025  
**Versão:** 1.0.0  
**Status:** Fundacional - Base para Novo Repositório

