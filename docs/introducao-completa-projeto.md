# 📚 INTRODUÇÃO COMPLETA AO PROJETO - Boilerplate Backend Enterprise

**Data:** Janeiro 2025  
**Público-Alvo:** Desenvolvedores, arquitetos e gestores técnicos  
**Objetivo:** Contextualizar completamente o projeto, seus objetivos, padrões e visão estratégica

---

## 📋 ÍNDICE

1. [O Que É Este Projeto?](#o-que-é-este-projeto)
2. [Por Que Este Projeto Existe?](#por-que-este-projeto-existe)
3. [Contexto Histórico: O Laboratório](#contexto-histórico-o-laboratório)
4. [Visão Estratégica](#visão-estratégica)
5. [Filosofia e Princípios Fundamentais](#filosofia-e-princípios-fundamentais)
6. [O Que Estamos Construindo](#o-que-estamos-construindo)
7. [O Que NÃO Estamos Construindo](#o-que-não-estamos-construindo)
8. [Padrões e Regras](#padrões-e-regras)
9. [Arquitetura em Camadas](#arquitetura-em-camadas)
10. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
11. [Metas e Objetivos](#metas-e-objetivos)
12. [Como Este Documento Se Relaciona com Outros](#como-este-documento-se-relaciona-com-outros)
13. [Próximos Passos](#próximos-passos)

---

## O QUE É ESTE PROJETO?

### Definição Simples

Este projeto é a criação de um **boilerplate backend enterprise** - uma base técnica reutilizável que serve como ponto de partida para qualquer projeto backend Node.js.

**Pense nisso como:**
- Um **template profissional** que já vem com tudo configurado
- Uma **fundação sólida** sobre a qual construir aplicações
- Um **conjunto de padrões** que garantem qualidade e consistência
- Uma **base técnica** que evita retrabalho e acelera desenvolvimento

### Analogia: A Casa e a Fundação

Imagine que você quer construir várias casas diferentes:
- Uma casa pequena (projeto simples)
- Uma casa média (projeto médio)
- Um prédio (projeto grande)

**Sem boilerplate:** Você precisa cavar, fazer a fundação, instalar encanamento, elétrica, etc. para cada casa. Muito trabalho repetitivo.

**Com boilerplate:** Você já tem uma fundação sólida, encanamento e elétrica prontos. Você só precisa construir as paredes e personalizar o interior (regras de negócio).

**Este projeto é essa fundação.**

---

## POR QUE ESTE PROJETO EXISTE?

### O Problema que Resolve

**Problema 1: Retrabalho Constante**

Toda vez que você inicia um novo projeto backend, precisa:
- Configurar TypeScript
- Configurar Fastify
- Configurar Prisma
- Configurar autenticação (JWT)
- Configurar validação (Zod)
- Configurar testes
- Configurar CI/CD
- Configurar segurança (Helmet, CORS, Rate Limit)
- E muito mais...

**Isso leva semanas** e é trabalho repetitivo que não agrega valor ao produto final.

**Solução:** Boilerplate já vem com tudo isso configurado e testado.

---

**Problema 2: Inconsistência Entre Projetos**

Quando você trabalha em múltiplos projetos:
- Cada projeto tem estrutura diferente
- Cada projeto usa padrões diferentes
- Cada projeto tem configurações diferentes
- É difícil alternar entre projetos

**Isso causa:**
- Confusão
- Erros
- Tempo perdido aprendendo cada projeto
- Código inconsistente

**Solução:** Boilerplate padroniza tudo. Todos os projetos seguem mesmos padrões.

---

**Problema 3: Decisões Arquiteturais Repetidas**

A cada novo projeto, você precisa decidir:
- Como estruturar pastas?
- Como organizar código?
- Como fazer Dependency Injection?
- Como testar?
- Como validar dados?
- Como tratar erros?

**Isso leva tempo** e pode gerar decisões ruins se feito com pressa.

**Solução:** Boilerplate já tem todas essas decisões tomadas e documentadas.

---

**Problema 4: Falta de Padrões Enterprise**

Projetos pequenos muitas vezes não têm:
- Testes adequados
- Segurança configurada
- Observabilidade (logs, métricas)
- CI/CD
- Documentação

**Isso causa:**
- Código frágil
- Dificuldade de manutenção
- Problemas de segurança
- Dificuldade de escalar

**Solução:** Boilerplate já vem com tudo isso configurado seguindo padrões enterprise.

---

### O Valor que Entrega

**Para Desenvolvedores:**
- ✅ Foco em regras de negócio, não em configuração
- ✅ Padrões claros reduzem esforço cognitivo
- ✅ Onboarding rápido (1 hora para estar produtivo)
- ✅ Código consistente e previsível

**Para Projetos:**
- ✅ Base sólida desde o início
- ✅ Qualidade enterprise garantida
- ✅ Escalável e manutenível
- ✅ Testável e confiável

**Para Organizações:**
- ✅ Padrão único entre projetos
- ✅ Fácil manutenção por diferentes times
- ✅ Reduz tempo de desenvolvimento
- ✅ Reduz bugs e problemas técnicos

---

## CONTEXTO HISTÓRICO: O LABORATÓRIO

### O Que Foi o Laboratório?

Antes de criar o boilerplate oficial, criamos um **repositório experimental** (chamado de "laboratório") para:

1. **Testar ideias arquiteturais**
   - Experimentar diferentes estruturas de pastas
   - Testar padrões e abstrações
   - Validar decisões técnicas

2. **Aprender com erros**
   - Identificar o que funciona bem
   - Identificar o que não funciona
   - Entender trade-offs de cada decisão

3. **Documentar decisões**
   - Registrar por que cada decisão foi tomada
   - Documentar alternativas consideradas
   - Criar base de conhecimento

### O Que Aprendemos no Laboratório?

**✅ O Que Funcionou Bem:**
- Services como classes com Dependency Injection
- Repositories como factories
- Validação com Zod integrada ao Fastify
- Separação de responsabilidades por camadas
- Error handler global

**❌ O Que Não Funcionou:**
- Estrutura de pastas por camada técnica (arquivos distantes)
- Isolamento excessivo de testes (muito lentos)
- Abstrações criadas "por precaução" (overengineering)
- Falta de multi-tenancy desde o início

**📚 Lições Aprendidas:**
- Clareza > Inteligência
- Proximidade lógica importa
- Pragmatismo sobre perfeição
- Performance importa (mesmo em testes)

### Por Que Não Usar o Laboratório Diretamente?

O laboratório foi **experimental**. Ele:
- Tem decisões que não funcionaram bem
- Tem código que precisa ser refatorado
- Tem estrutura que precisa ser reorganizada
- Tem abstrações desnecessárias

**Decisão:** Criar novo repositório do zero seguindo as lições aprendidas.

---

## VISÃO ESTRATÉGICA

### O Objetivo Final

Criar um **boilerplate backend enterprise** que seja:

1. **Poderoso**
   - Suporta projetos grandes e complexos
   - Escalável sem degradação
   - Performance otimizada
   - Segurança enterprise-grade

2. **Padronizado**
   - Padrões claros e consistentes
   - Estrutura previsível
   - Convenções bem definidas
   - Fácil de seguir

3. **Firme**
   - Base sólida e confiável
   - Testes abrangentes
   - Código limpo e manutenível
   - Documentação completa

4. **Simples de Entender**
   - Fluxo claro e documentado
   - Código explícito (não implícito)
   - Estrutura que reflete o fluxo
   - Onboarding rápido

5. **Com Bons Padrões**
   - SOLID rigorosamente aplicado
   - Separação de responsabilidades
   - Dependency Injection
   - Type safety
   - Testabilidade

### Princípios Não Negociáveis

**1. Clareza > Inteligência**
- Código explícito, não implícito
- Fluxos claros e documentados
- Pouca mágica, muita explicitação

**2. Pragmatismo sobre Perfeição**
- Criar abstrações apenas quando necessário
- Evitar overengineering
- Priorizar simplicidade quando possível

**3. Developer Experience como Prioridade**
- Desenvolvedor deve focar em regra de negócio
- Infraestrutura deve ser padrão e transparente
- Onboarding rápido e simples

**4. Escalabilidade Real**
- Escalar pessoas (fácil de entender)
- Escalar manutenção (padrões claros)
- Escalar domínio (fácil adicionar módulos)

**5. Qualidade desde o Início**
- Testes desde o início
- Type safety sempre
- Código limpo e manutenível
- Documentação completa

---

## FILOSOFIA E PRINCÍPIOS FUNDAMENTAIS

### 1. Arquitetura antes de Código

**O que significa:**
- Decisões arquiteturais vêm antes de implementação
- Fluxos claros antes de abstrações
- Documentação antes de código

**Por quê:**
- Evita retrabalho
- Garante consistência
- Facilita manutenção

**Como aplicar:**
- Documentar decisões antes de implementar
- Seguir padrões estabelecidos
- Revisar arquitetura regularmente

---

### 2. Clareza > Inteligência

**O que significa:**
- Código explícito, não implícito
- Fluxos claros e documentados
- Pouca mágica, muita explicitação
- Fácil de entender sem contexto prévio

**Por quê:**
- Reduz esforço cognitivo
- Facilita onboarding
- Facilita manutenção
- Reduz bugs

**Como aplicar:**
- Nomes descritivos
- Estrutura que reflete o fluxo
- Comentários quando necessário
- Documentação clara

**Exemplo:**

```typescript
// ❌ Implícito - Precisa contexto para entender
const result = process(data);

// ✅ Explícito - Fica claro o que faz
const serializedUsers = serializeUsersPage(users, page, total);
```

---

### 3. Pragmatismo sobre Perfeição

**O que significa:**
- Criar abstrações apenas quando necessário
- Evitar overengineering
- Priorizar simplicidade quando possível
- YAGNI (You Aren't Gonna Need It)

**Por quê:**
- Overengineering adiciona complexidade sem valor
- Simplicidade facilita manutenção
- Abstrações desnecessárias dificultam entendimento

**Como aplicar:**
- Não criar interface se não há múltiplas implementações
- Não criar abstração "por precaução"
- Remover código não usado
- Validar necessidade antes de criar abstração

**Exemplo:**

```typescript
// ❌ Overengineering - Interface desnecessária
interface IArgon2Service {
  hash(password: string): Promise<string>;
}
// Sempre será Argon2, não precisa abstrair

// ✅ Pragmático - Usar diretamente
import { hash } from 'argon2';
const password_hash = await hash(password);
```

---

### 4. Proximidade Lógica

**O que significa:**
- Arquivos que trabalham juntos devem estar próximos
- Reduzir "saltos mentais" entre arquivos relacionados
- Estrutura facilita entendimento

**Por quê:**
- Reduz esforço cognitivo
- Facilita navegação
- Facilita manutenção
- Facilita onboarding

**Como aplicar:**
- Agrupar por domínio, não por camada técnica
- Middlewares próximos das rotas que usam (quando específicos)
- Services próximos dos repositories que usam

**Exemplo:**

```
// ❌ Distante - Arquivos relacionados longe
src/http/middlewares/authenticate.ts
src/modules/users/users.routes.ts  ← Usa authenticate acima

// ✅ Próximo - Tudo relacionado junto
src/modules/users/
├── users.routes.ts      ← Rota
├── users.service.ts     ← Service (usa repository abaixo)
├── users.repository.ts  ← Repository (próximo do service)
└── users.schemas.ts     ← Schemas (usados pela rota)
```

---

### 5. Escalabilidade Real

**O que significa:**
- Escalar pessoas (fácil de entender e manter)
- Escalar manutenção (padrões claros)
- Escalar domínio (fácil adicionar módulos)
- Escalar performance (otimizações quando necessário)

**Por quê:**
- Projetos crescem
- Times crescem
- Requisitos mudam
- Performance importa

**Como aplicar:**
- Padrões claros e documentados
- Estrutura previsível
- Testes rápidos
- Performance otimizada quando necessário

---

### 6. Developer Experience como Cidadão de Primeira Classe

**O que significa:**
- Desenvolvedor deve focar em regra de negócio
- Infra, validação, erro, logging, cache devem ser padrão
- Onboarding rápido
- Desenvolvimento de módulos simples

**Por quê:**
- Desenvolvedor produtivo = projeto produtivo
- Reduz tempo de desenvolvimento
- Reduz erros
- Facilita contratação

**Como aplicar:**
- Padrões claros e previsíveis
- Documentação completa
- Exemplos práticos
- Templates e generators (futuro)

---

## O QUE ESTAMOS CONSTRUINDO

### Escopo do Boilerplate

**O que INCLUI:**

1. **Infraestrutura Técnica**
   - Configuração completa do Fastify
   - Configuração do Prisma (ORM)
   - Configuração do Redis (Cache)
   - Configuração de segurança (Helmet, CORS, Rate Limit)
   - Configuração de autenticação (JWT)
   - Configuração de validação (Zod)
   - Configuração de testes (Vitest)
   - Configuração de CI/CD (GitHub Actions)

2. **Padrões Arquiteturais**
   - Estrutura de pastas padronizada
   - Padrão de módulos (routes, service, repository, schemas)
   - Dependency Injection
   - Separação de responsabilidades
   - Error handling global
   - Logging estruturado

3. **Módulos Base**
   - Autenticação (register, login)
   - Usuários (CRUD básico)
   - Organizações (multi-tenancy)

4. **Developer Experience**
   - Documentação completa
   - Exemplos práticos
   - Padrões claros
   - Onboarding simples

**O que NÃO INCLUI:**

- ❌ Regras de negócio específicas (isso é responsabilidade do projeto)
- ❌ Features complexas (isso é responsabilidade do projeto)
- ❌ Integrações específicas (isso é responsabilidade do projeto)

**Filosofia:** Boilerplate fornece **infraestrutura e padrões**. Projetos adicionam **regras de negócio**.

---

### Multi-Tenancy desde o Início

**O que é Multi-Tenancy?**

Multi-tenancy é a capacidade de um sistema servir múltiplos "tenants" (organizações/clientes) isoladamente usando a mesma infraestrutura.

**Exemplo Prático:**

Imagine um sistema SaaS que serve múltiplas empresas:
- Empresa A tem seus usuários e dados
- Empresa B tem seus usuários e dados
- Ambos usam o mesmo sistema, mas dados são isolados

**Por Que desde o Início?**

1. **Mais fácil implementar desde o início** do que depois
2. **Evita refatoração massiva** no futuro
3. **Padrão estabelecido** desde o começo
4. **Boilerplate será usado** por projetos que precisam multi-tenancy

**Como Funciona:**

- Cada entidade tem `organization_id`
- Queries sempre filtram por `organization_id`
- Middleware resolve tenant do request
- Dados isolados por tenant

---

## O QUE NÃO ESTAMOS CONSTRUINDO

### Overengineering

**Não faremos:**
- Abstrações sem necessidade real
- Interfaces para coisas que não vão ter múltiplas implementações
- Padrões complexos quando simples funcionam
- Código "por precaução"

**Exemplos do que NÃO fazer:**
- `IStringUtils` - Não há múltiplas implementações
- `IArgon2Service` - Sempre será Argon2
- Circuit Breaker antes de precisar

**Filosofia:** YAGNI (You Aren't Gonna Need It)

---

### Separação Excessiva por Camadas Técnicas

**Não faremos:**
- Separar tudo por camada técnica (`http/`, `services/`, `repositories/`)
- Criar distância entre arquivos relacionados
- Priorizar "camadas" sobre "fluxo"

**Exemplos do que NÃO fazer:**
- Todos os middlewares em `http/middlewares/` mesmo sendo específicos de módulo
- Services distantes dos repositories que usam
- Rotas distantes dos handlers

**Filosofia:** Proximidade lógica importa mais que separação técnica.

---

### Testes Lentos "por Isolamento"

**Não faremos:**
- Criar instância completa do Fastify para testes unitários
- Limpar banco antes de cada teste unitário
- Registrar todos os plugins para testes unitários

**Filosofia:** Performance importa. Isolamento adequado, não excessivo.

---

### Código Morto

**Não faremos:**
- Manter código não usado
- Abstrações criadas mas não utilizadas
- Features implementadas mas não usadas

**Filosofia:** Código limpo = código usado.

---

## PADRÕES E REGRAS

### Estrutura de Módulos

**Padrão Obrigatório:**

Cada módulo de domínio deve seguir esta estrutura:

```
modules/{module}/
├── {module}.routes.ts      # ✅ Rotas HTTP
├── {module}.service.ts     # ✅ Lógica de negócio
├── {module}.repository.ts  # ✅ Acesso a dados
├── {module}.schemas.ts     # ✅ Validação (Zod)
├── {module}.dto.ts         # ⚠️ DTOs (quando necessário)
├── {module}.serializers.ts # ⚠️ Serializers (quando necessário)
└── __tests__/              # ✅ Testes
    ├── unit/
    └── integration/
```

**Por Que Esta Estrutura?**

- **Tudo relacionado está junto** - Fácil encontrar arquivos
- **Fluxo claro** - Routes → Service → Repository
- **Padrão consistente** - Todos os módulos seguem mesmo padrão
- **Fácil adicionar novos módulos** - Basta seguir o padrão

---

### Padrão de Nomenclatura

**Arquivos:**
- `kebab-case.ts` ou `camelCase.ts` (consistente no módulo)
- Exemplo: `users.routes.ts`, `users.service.ts`

**Pastas:**
- `kebab-case`
- Exemplo: `modules/users/`, `infrastructure/cache/`

**Classes:**
- `PascalCase`
- Exemplo: `UsersService`, `AuthService`

**Funções:**
- `camelCase`
- Exemplo: `findAll()`, `create()`, `serializeUser()`

**Constantes:**
- `UPPER_SNAKE_CASE`
- Exemplo: `CACHE_TTL`, `MAX_RETRY_ATTEMPTS`

**Por Que?**

- Consistência facilita navegação
- Padrões claros reduzem esforço cognitivo
- Convenções previsíveis facilitam onboarding

---

### Separação de Responsabilidades

**Routes (Rotas HTTP):**
- ✅ Receber request e extrair dados
- ✅ Chamar métodos de service
- ✅ Retornar resposta formatada
- ❌ NÃO contém lógica de negócio
- ❌ NÃO acessa banco diretamente

**Service (Lógica de Negócio):**
- ✅ Contém lógica de negócio
- ✅ Orquestra chamadas a repositories
- ✅ Gerencia cache
- ✅ Valida regras de negócio
- ❌ NÃO conhece detalhes de HTTP
- ❌ NÃO conhece detalhes de infraestrutura diretamente

**Repository (Acesso a Dados):**
- ✅ Acessa banco de dados
- ✅ Executa queries Prisma
- ✅ Retorna DTOs tipados
- ❌ NÃO contém lógica de negócio
- ❌ NÃO gerencia cache

**Por Que Esta Separação?**

- **Responsabilidades claras** - Cada camada tem um propósito
- **Fácil de testar** - Cada camada pode ser testada isoladamente
- **Fácil de manter** - Mudanças em uma camada não afetam outras
- **Fácil de entender** - Fluxo claro e previsível

---

### Dependency Injection

**O que é?**

Dependency Injection (DI) é um padrão onde dependências são "injetadas" em uma classe via construtor, em vez de serem criadas dentro da classe.

**Exemplo:**

```typescript
// ❌ Sem DI - Dependência criada dentro da classe
export class UsersService {
  private cache = new CacheService(); // ← Criado dentro
  
  async findAll() {
    // Usa this.cache
  }
}

// ✅ Com DI - Dependência injetada via construtor
export class UsersService {
  constructor(
    private readonly cache: ICacheService, // ← Injetado
  ) {}
  
  async findAll() {
    // Usa this.cache
  }
}
```

**Por Que Usar DI?**

- ✅ **Fácil de testar** - Pode injetar mocks
- ✅ **Flexível** - Pode trocar implementações
- ✅ **Desacoplado** - Depende de interface, não implementação
- ✅ **Type-safe** - TypeScript garante tipos corretos

**Como Funciona no Boilerplate:**

```typescript
// 1. Interface define contrato
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttl: number): Promise<void>;
}

// 2. Implementação concreta
export function createCacheService(logger: ILogger): ICacheService {
  return {
    async get(key) { /* ... */ },
    async set(key, value, ttl) { /* ... */ },
  };
}

// 3. Service usa interface (não implementação)
export class UsersService {
  constructor(
    private readonly cache: ICacheService, // ← Interface, não implementação
  ) {}
}

// 4. Factory cria e injeta dependências
export function createServices(app: FastifyInstance) {
  const cache = createCacheService(logger);
  const usersService = new UsersService(cache);
  return { cache, usersService };
}
```

---

### Validação com Zod

**O que é Zod?**

Zod é uma biblioteca de validação TypeScript que permite criar schemas e validar dados em runtime.

**Por Que Zod?**

- ✅ **Type-safe** - Validação integrada com TypeScript
- ✅ **Integração perfeita** - Funciona bem com Fastify
- ✅ **Schemas reutilizáveis** - Fácil criar schemas base
- ✅ **Documentação automática** - Swagger gerado automaticamente

**Como Funciona:**

```typescript
// 1. Define schema Zod
export const createUserSchema = {
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
};

// 2. Usa na rota
app.post(
  '/users',
  {
    schema: createUserSchema, // ← Fastify valida automaticamente
  },
  async (request, reply) => {
    // request.body já está validado e tipado!
    const { name, email, password } = request.body;
    // ...
  },
);

// 3. Se inválido, Fastify retorna 400 automaticamente
```

**Onde Validar?**

- ✅ **Na camada HTTP** (rotas) - Validação de entrada
- ❌ **NÃO no service** - Service recebe dados já validados

**Por Que?**

- Separação de responsabilidades
- Service não precisa validar novamente
- Validação é responsabilidade da camada HTTP

---

### Error Handling Global

**O que é?**

Error handler global captura todos os erros lançados na aplicação e formata resposta de erro consistente.

**Por Que Global?**

- ✅ **Consistência** - Todas as respostas de erro seguem mesmo formato
- ✅ **Simplicidade** - Rotas não precisam tratar erros
- ✅ **Centralização** - Lógica de erro em um lugar só

**Como Funciona:**

```typescript
// 1. Lança erro customizado no service
export class UsersService {
  async findById(id: string) {
    const user = await this.repository.findById(id);
    
    if (!user) {
      throw new ResourceNotFoundError('User not found.'); // ← Lança erro
    }
    
    return user;
  }
}

// 2. Error handler global captura e formata
export const errorHandler: FastifyInstance['errorHandler'] = (
  error,
  request,
  reply,
) => {
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      timestamp: new Date().toISOString(),
      statusCode: 404,
      code: 'ERR_NOT_FOUND',
      message: error.message,
    });
  }
  
  // ... outros tipos de erro
};

// 3. Rota não precisa tratar erro
app.get('/users/:id', async (request, reply) => {
  const user = await usersService.findById(request.params.id);
  return reply.send(user);
  // Se erro, error handler trata automaticamente
});
```

**Classes de Erro Disponíveis:**

- `AppError` - Base (400)
- `UnauthorizedError` - 401
- `ForbiddenError` - 403
- `ResourceNotFoundError` - 404
- `ConflictError` - 409

---

## ARQUITETURA EM CAMADAS

### Visão Geral

A aplicação segue uma **arquitetura em camadas**, onde cada camada tem responsabilidades bem definidas:

```
HTTP Request
    ↓
[Plugins Globais] → Helmet, CORS, Rate Limit, JWT
    ↓
[Rotas] → Registro e definição de endpoints
    ↓
[Validação] → Zod valida entrada automaticamente
    ↓
[Middlewares] → Autenticação, Autorização, Tenant Resolution
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

### Camadas Detalhadas

#### 1. Camada HTTP (Rotas)

**Responsabilidade:** Receber requests HTTP e retornar responses HTTP.

**O que faz:**
- Define endpoints (GET, POST, PUT, DELETE)
- Extrai dados da requisição (query, params, body)
- Chama métodos de service
- Retorna resposta formatada

**O que NÃO faz:**
- ❌ Lógica de negócio
- ❌ Acesso a banco de dados
- ❌ Validação manual (usa Zod)

**Exemplo:**

```typescript
// src/modules/users/users.routes.ts
export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  const { usersService } = app.services;
  
  app.get(
    '/',
    {
      schema: listUsersSchema, // ← Validação automática
      preHandler: [authenticate, authorize(['ADMIN', 'USER'])], // ← Middlewares
    },
    async (request, reply) => {
      // Extrai dados
      const { page, limit } = request.query;
      const tenant = request.tenant;
      
      // Chama service
      const result = await usersService.findAll(tenant.id, page, limit);
      
      // Retorna resposta
      return reply.send(result);
    },
  );
};
```

---

#### 2. Camada de Validação (Schemas)

**Responsabilidade:** Validar dados de entrada (body, query, params).

**O que faz:**
- Define schemas Zod
- Valida dados automaticamente
- Retorna 400 se inválido

**O que NÃO faz:**
- ❌ Validação de regras de negócio (isso é service)
- ❌ Transformação de dados (isso é serializer)

**Exemplo:**

```typescript
// src/modules/users/users.schemas.ts
export const listUsersSchema = {
  tags: ['Users'],
  summary: 'List users with pagination',
  querystring: z.object({
    page: z.coerce.number().default(1).min(1),
    limit: z.coerce.number().default(10).min(1).max(100),
  }),
  response: {
    200: paginableSchema(userPublicSchema),
  },
};
```

---

#### 3. Camada de Middlewares

**Responsabilidade:** Processar requests antes do handler (autenticação, autorização, etc.).

**O que faz:**
- Autentica usuário (verifica JWT)
- Autoriza acesso (verifica roles)
- Resolve tenant (multi-tenancy)
- Adiciona contexto ao request

**O que NÃO faz:**
- ❌ Lógica de negócio
- ❌ Acesso a banco de dados diretamente

**Exemplo:**

```typescript
// src/http/middlewares/authenticate.ts
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify(); // ← Verifica JWT
    // Se válido, request.user é populado automaticamente
  } catch {
    throw new UnauthorizedError('Invalid or missing token.');
  }
}
```

---

#### 4. Camada de Service (Lógica de Negócio)

**Responsabilidade:** Contém lógica de negócio e orquestra operações.

**O que faz:**
- Valida regras de negócio
- Orquestra chamadas a repositories
- Gerencia cache
- Lança erros customizados

**O que NÃO faz:**
- ❌ Conhece detalhes de HTTP
- ❌ Acessa banco diretamente (usa repository)
- ❌ Valida entrada (já validado pela camada HTTP)

**Exemplo:**

```typescript
// src/modules/users/users.service.ts
export class UsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}
  
  async findAll(tenantId: string, page: number, limit: number) {
    // 1. Tenta buscar no cache
    const cacheKey = `users:${tenantId}:list:page:${page}:limit:${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    // 2. Calcula paginação
    const skip = (page - 1) * limit;
    
    // 3. Busca dados (paralelo)
    const [data, total] = await Promise.all([
      this.repository.findAll(tenantId, skip, limit),
      this.repository.count(tenantId),
    ]);
    
    // 4. Serializa resultado
    const result = serializeUsersPage(data, page, total);
    
    // 5. Armazena no cache
    await this.cache.set(cacheKey, result, CACHE_TTL.USER_LIST);
    
    // 6. Retorna
    return result;
  }
}
```

---

#### 5. Camada de Repository (Acesso a Dados)

**Responsabilidade:** Acessa banco de dados e retorna dados tipados.

**O que faz:**
- Executa queries Prisma
- Retorna DTOs tipados
- Filtra por tenant (multi-tenancy)

**O que NÃO faz:**
- ❌ Lógica de negócio
- ❌ Gerencia cache
- ❌ Valida regras de negócio

**Exemplo:**

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
        where: { organization_id: tenantId }, // ← Filtra por tenant
        skip,
        take,
        select: userSelect, // ← Seleção específica de campos
        orderBy: { created_at: 'desc' },
      });
    },
  };
}
```

---

#### 6. Camada de Serializer (Formatação)

**Responsabilidade:** Formata dados para resposta da API.

**O que faz:**
- Converte tipos (Date → string)
- Remove campos sensíveis
- Formata estrutura
- Garante formato consistente

**O que NÃO faz:**
- ❌ Lógica de negócio
- ❌ Acesso a banco de dados

**Exemplo:**

```typescript
// src/modules/users/users.serializers.ts
export function serializeUser(user: UserDTO) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at.toISOString(), // ← Date → string
    // password_hash não é incluído (campo sensível)
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
    data: users.map(serializeUser), // ← Serializa cada usuário
  };
}
```

---

### Regras de Dependência Entre Camadas

**Regra Fundamental:**

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

**Exemplo Prático:**

```typescript
// ✅ CORRETO - Module depende de interface (core)
import type { ICacheService } from '@/core/interfaces/cache.interface';

// ❌ INCORRETO - Module depende de implementação (infrastructure)
import { cacheService } from '@/infrastructure/cache/cache-service';
```

---

## FLUXO DE DESENVOLVIMENTO

### Como Criar um Novo Módulo

**Passo a Passo:**

**1. Criar Estrutura Básica**
```
modules/tasks/
├── tasks.routes.ts
├── tasks.service.ts
├── tasks.repository.ts
├── tasks.schemas.ts
└── __tests__/
    ├── unit/
    └── integration/
```

**2. Definir Schemas (Validação)**
```typescript
// tasks.schemas.ts
export const createTaskSchema = {
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
  }),
};
```

**3. Implementar Repository (Dados)**
```typescript
// tasks.repository.ts
export function createTasksRepository(prisma: PrismaClient) {
  return {
    async findAll(tenantId: string, skip: number, take: number) {
      return await prisma.task.findMany({
        where: { organization_id: tenantId },
        skip,
        take,
      });
    },
  };
}
```

**4. Implementar Service (Negócio)**
```typescript
// tasks.service.ts
export class TasksService {
  constructor(
    private readonly repository: ITasksRepository,
  ) {}
  
  async findAll(tenantId: string, page: number, limit: number) {
    // Lógica de negócio
  }
}
```

**5. Implementar Routes (HTTP)**
```typescript
// tasks.routes.ts
export const tasksRoutes: FastifyPluginAsyncZod = async (app) => {
  const { tasksService } = app.services;
  
  app.get('/', {
    schema: listTasksSchema,
    preHandler: [authenticate, tenantResolver],
  }, async (request, reply) => {
    const result = await tasksService.findAll(request.tenant.id, request.query);
    return reply.send(result);
  });
};
```

**6. Registrar Rotas**
```typescript
// config/plugins/routes.config.ts
await app.register(tasksRoutes, { prefix: '/tasks' });
```

**7. Escrever Testes**
```typescript
// __tests__/unit/tasks.service.test.ts
describe('TasksService', () => {
  it('should return paginated tasks', async () => {
    // Teste unitário com mocks
  });
});
```

**Tempo Estimado:** 1-2 horas para módulo completo com testes.

---

### Ordem Recomendada de Desenvolvimento

**1. Schemas Primeiro**
- Define contrato da API
- Validação clara
- Documentação automática

**2. Repository Depois**
- Queries de dados
- Base para service

**3. Service em Seguida**
- Lógica de negócio
- Usa repository

**4. Routes Por Último**
- Conecta tudo
- Expõe API

**5. Testes Durante**
- Testa cada camada
- Garante qualidade

---

## METAS E OBJETIVOS

### Metas de Curto Prazo (3-6 meses)

**1. Base Arquitetural Sólida**
- ✅ Estrutura de pastas definida e documentada
- ✅ Padrões estabelecidos e seguidos
- ✅ Separação de responsabilidades clara
- ✅ Dependency Injection implementado

**2. Qualidade Técnica**
- ✅ TypeScript strict mode sempre habilitado
- ✅ Testes abrangentes (80%+ coverage)
- ✅ Código limpo e manutenível
- ✅ Zero erros TypeScript e linter

**3. Developer Experience**
- ✅ Documentação completa
- ✅ Exemplos práticos
- ✅ Onboarding rápido (< 1 hora)
- ✅ Padrões claros e previsíveis

**4. Infraestrutura**
- ✅ Multi-tenancy implementado
- ✅ Segurança enterprise-grade
- ✅ Performance otimizada
- ✅ Observabilidade básica

---

### Metas de Médio Prazo (6-12 meses)

**1. Boilerplate Reutilizável**
- ✅ Completamente reutilizável em múltiplos projetos
- ✅ Generator de módulos funcional
- ✅ Templates e exemplos completos
- ✅ Padrões validados em produção

**2. Developer Experience Avançada**
- ✅ Generator CLI funcional
- ✅ Templates para todos os arquivos
- ✅ Scripts úteis de desenvolvimento
- ✅ VS Code snippets

**3. Operações**
- ✅ CI/CD completo e otimizado
- ✅ Observabilidade completa
- ✅ Métricas e monitoramento
- ✅ Alertas configurados

---

### Metas de Longo Prazo (12+ meses)

**1. Reconhecimento**
- ✅ Boilerplate enterprise reconhecido
- ✅ Base para múltiplos projetos em produção
- ✅ Padrões validados em escala
- ✅ Comunidade e contribuições (se aplicável)

**2. Evolução Contínua**
- ✅ Feedback incorporado
- ✅ Padrões evoluindo baseados em experiência
- ✅ Documentação sempre atualizada
- ✅ Base sólida para futuro

---

## COMO ESTE DOCUMENTO SE RELACIONA COM OUTROS

### Documentos Relacionados

**1. `docs/arquitetura-definitiva-boilerplate-oficial.md`**

**O que é:** Documento arquitetural definitivo e detalhado.

**Como se relaciona:**
- Este documento (introdução) explica **o que** e **por quê**
- Arquitetura definitiva explica **como** implementar
- Leia este primeiro para entender contexto
- Leia arquitetura definitiva para implementar

**Quando usar:**
- Antes de criar novo repositório
- Durante implementação do boilerplate
- Quando precisar tomar decisões arquiteturais

---

**2. `docs/comparacao-laboratorio-vs-boilerplate.md`**

**O que é:** Comparação detalhada entre laboratório e boilerplate oficial.

**Como se relaciona:**
- Este documento explica **contexto geral**
- Comparação explica **o que mudou** e **por quê**
- Útil para entender evolução e lições aprendidas

**Quando usar:**
- Para entender decisões do boilerplate
- Para entender o que não fazer
- Para entender evolução do projeto

---

**3. `docs/padroes-estrutura-modulos.md`**

**O que é:** Documentação detalhada sobre estrutura de módulos.

**Como se relaciona:**
- Este documento explica **visão geral**
- Padrões de estrutura explica **detalhes específicos**
- Útil quando criar novos módulos

**Quando usar:**
- Ao criar novo módulo
- Para entender quando usar DTOs e serializers
- Para validar estrutura de módulo

---

**4. `docs/padroes-nomenclatura.md`**

**O que é:** Documentação sobre padrões de nomenclatura.

**Como se relaciona:**
- Este documento explica **filosofia geral**
- Padrões de nomenclatura explica **regras específicas**
- Útil para garantir consistência

**Quando usar:**
- Ao criar novos arquivos
- Ao nomear classes, funções, variáveis
- Para validar nomenclatura

---

**5. `docs/fluxo-aplicacao.md`**

**O que é:** Documentação detalhada do fluxo Request → Response.

**Como se relaciona:**
- Este documento explica **visão geral**
- Fluxo da aplicação explica **detalhes técnicos**
- Útil para entender como tudo funciona junto

**Quando usar:**
- Para entender fluxo completo
- Para debugar problemas
- Para onboarding de novos desenvolvedores

---

### Fluxo de Leitura Recomendado

**Para Novo Desenvolvedor:**

1. **Este documento** (introdução completa) - Entender contexto geral
2. **`docs/fluxo-aplicacao.md`** - Entender como funciona
3. **`docs/padroes-estrutura-modulos.md`** - Entender estrutura
4. **`docs/padroes-nomenclatura.md`** - Entender nomenclatura
5. **`docs/arquitetura-definitiva-boilerplate-oficial.md`** - Referência técnica

**Para Arquitetos:**

1. **Este documento** - Entender visão estratégica
2. **`docs/arquitetura-definitiva-boilerplate-oficial.md`** - Entender arquitetura detalhada
3. **`docs/comparacao-laboratorio-vs-boilerplate.md`** - Entender decisões

**Para Implementação:**

1. **`docs/arquitetura-definitiva-boilerplate-oficial.md`** - Seguir passo a passo
2. **`docs/padroes-estrutura-modulos.md`** - Criar módulos seguindo padrão
3. **Este documento** - Consultar quando precisar de contexto

---

## PRÓXIMOS PASSOS

### Para Começar a Usar o Boilerplate

**1. Ler Documentação Completa**
- Este documento (introdução)
- Arquitetura definitiva
- Padrões de estrutura e nomenclatura

**2. Criar Novo Repositório**
- Seguir checklist de implementação
- Implementar fase por fase
- Validar cada fase antes de prosseguir

**3. Seguir Padrões**
- Estrutura de módulos
- Nomenclatura
- Separação de responsabilidades

**4. Escrever Testes**
- Testes unitários para services
- Testes de integração para rotas
- Cobertura mínima 80%

---

### Para Contribuir com o Boilerplate

**1. Entender Filosofia**
- Ler este documento completamente
- Entender princípios fundamentais
- Entender o que NÃO fazer

**2. Seguir Padrões**
- Estrutura definida
- Nomenclatura padronizada
- Separação de responsabilidades

**3. Documentar Decisões**
- Documentar por que cada decisão foi tomada
- Documentar alternativas consideradas
- Atualizar documentação quando necessário

**4. Validar Qualidade**
- Testes passando
- Zero erros TypeScript
- Zero warnings linter
- Código limpo e manutenível

---

## CONCLUSÃO

Este documento apresentou uma **visão completa e contextualizada** do projeto de criação do boilerplate backend enterprise.

**Principais Pontos:**

1. **Este é um projeto de infraestrutura**, não de regras de negócio específicas
2. **Foco em padrões e qualidade**, não em features complexas
3. **Developer Experience é prioridade** - Desenvolvedor deve focar em negócio
4. **Pragmatismo sobre perfeição** - Evitar overengineering
5. **Base sólida desde o início** - Multi-tenancy, testes, segurança

**Próximos Passos:**

1. Ler `docs/arquitetura-definitiva-boilerplate-oficial.md` para detalhes técnicos
2. Ler `docs/comparacao-laboratorio-vs-boilerplate.md` para entender evolução
3. Seguir checklist de implementação para criar novo repositório
4. Usar padrões estabelecidos para criar módulos

**Este boilerplate não é um experimento. É uma fundação. Ele precisa nascer certo.**

---

**Documento criado em:** Janeiro 2025  
**Versão:** 1.0.0  
**Status:** Documento Introdutório - Base para Entendimento Completo

