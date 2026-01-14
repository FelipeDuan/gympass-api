# 🗺️ Roadmap Completo de Refatoração - API Solid

**Objetivo:** Transformar codebase em nível 10/10 de maturidade técnica  
**Abordagem:** Incremental, pragmática, validada passo a passo  
**Data de Criação:** Janeiro 2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Filosofia e Princípios](#filosofia-e-princípios)
3. [Roadmap Detalhado - Todas as Fases](#roadmap-detalhado---todas-as-fases)
4. [Decisões Arquiteturais](#decisões-arquiteturais)
5. [Riscos e Mitigações](#riscos-e-mitigações)
6. [Critérios de Sucesso](#critérios-de-sucesso)

---

## 1. Visão Geral

### 1.1 Objetivo Final

**Estado Almejado:**
- ✅ Código 100% testável (80%+ coverage)
- ✅ Zero acoplamentos desnecessários
- ✅ Dependency Injection completo
- ✅ Interfaces bem definidas
- ✅ Abstrações reutilizáveis (sem overengineering)
- ✅ Código limpo e manutenível
- ✅ Pronto para escalar

### 1.2 Estratégia Geral

**Abordagem Incremental:**
1. **Uma refatoração por vez** - Validar antes de prosseguir
2. **Manter compatibilidade** - Não quebrar código existente durante transição
3. **Testar cada passo** - Garantir que funciona antes de continuar
4. **Documentar decisões** - Registrar porquê de cada escolha

**Ordem de Execução:**
- Começar pelos problemas que bloqueiam testes
- Desacoplar infraestrutura primeiro
- Criar interfaces conforme necessário (não todas de uma vez)
- Migrar gradualmente, mantendo funcionamento

---

## 2. Filosofia e Princípios

### 2.1 Princípios Não Negociáveis

1. **Pragmatismo sobre Perfeição**
   - Criar abstrações apenas quando necessário
   - Evitar overengineering
   - Priorizar simplicidade quando possível

2. **Testabilidade como Prioridade**
   - Tudo deve ser testável
   - Código deve ser fácil de mockar
   - Testes devem ser rápidos e isolados

3. **Separação de Responsabilidades**
   - Cada camada tem responsabilidade única
   - Services não conhecem HTTP
   - Repositories não conhecem negócio

4. **Dependency Inversion**
   - Depender de abstrações, não implementações
   - Injetar dependências via construtor
   - Interfaces definem contratos claros

### 2.2 Abordagem para Abstrações

**Quando Criar Abstração:**
- ✅ Quando há múltiplas implementações possíveis
- ✅ Quando precisa mockar em testes
- ✅ Quando quer desacoplar de infraestrutura específica
- ✅ Quando facilita reutilização

**Quando NÃO Criar Abstração:**
- ❌ Quando há apenas uma implementação e não vai mudar
- ❌ Quando abstração não traz benefício real
- ❌ Quando adiciona complexidade sem valor
- ❌ Quando é "porque é bonito" sem necessidade prática

**Exemplos Práticos:**

✅ **BOM:** `ILogger` - Pode ter Pino, Winston, console.log
✅ **BOM:** `ICacheService` - Pode ter Redis, Memória, Memcached
✅ **BOM:** `ITokenService` - Pode ter JWT, OAuth, outros

❌ **RUIM:** `IStringUtils` - Não há múltiplas implementações
❌ **RUIM:** `IArgon2Service` - Sempre será Argon2, não precisa abstrair
❌ **RUIM:** `IUserEntity` - Prisma já fornece tipos, não precisa interface

---

## 3. Roadmap Detalhado - Todas as Fases

### 🔴 FASE 1: Desacoplar Circuit Breaker

**Duração:** 1-2 horas  
**Prioridade:** Crítica  
**Bloqueia:** Testes do Circuit Breaker, reutilização

#### Por Que Começar Aqui?

1. **Isolado e Bem Definido**
   - Problema claro e limitado
   - Não afeta muitas outras partes
   - Fácil de validar

2. **Estabelece Padrão**
   - Define como vamos fazer DI
   - Cria exemplo para outras refatorações
   - Mostra o caminho a seguir

3. **Bloqueia Testes**
   - Sem desacoplar, não dá para testar isoladamente
   - Precisa mockar `app` que é complexo
   - Dificulta testes unitários

#### O Que Fazer

1. **Criar `ILogger` interface**
   ```typescript
   // src/core/interfaces/logger.interface.ts
   export interface ILogger {
     info(data: unknown): void;
     warn(data: unknown): void;
     error(data: unknown): void;
     fatal(message: string): void;
     debug?(data: unknown): void;
   }
   ```

2. **Refatorar CircuitBreaker**
   - Remover `import { app } from '@/config/app'`
   - Adicionar `logger: ILogger` no construtor
   - Substituir `app.log.*` por `this.logger.*`

3. **Atualizar cache-service**
   - Criar função factory `createCacheService(logger: ILogger)`
   - Instanciar CircuitBreaker com logger
   - Manter export `cache` temporário (compatibilidade)

4. **Criar adapter do Fastify Logger**
   ```typescript
   // src/infra/logger/fastify-logger-adapter.ts
   export class FastifyLoggerAdapter implements ILogger {
     constructor(private logger: FastifyBaseLogger) {}
     // Implementar métodos
   }
   ```

5. **Atualizar onde CircuitBreaker é usado**
   - Passar logger adaptado do Fastify

#### Resultado Esperado

- ✅ CircuitBreaker totalmente desacoplado
- ✅ Pode ser testado isoladamente
- ✅ Pode ser reutilizado em outros contextos
- ✅ Código existente continua funcionando

#### Validação

- [ ] Testes unitários do CircuitBreaker passando
- [ ] Cache service continua funcionando
- [ ] Aplicação roda sem erros
- [ ] Logs aparecem corretamente

---

### 🟡 FASE 2: Criar Estrutura de Interfaces Base

**Duração:** 2-3 horas  
**Prioridade:** Alta  
**Depende:** Fase 1 completa

#### Por Que Agora?

1. **Já Temos Um Exemplo**
   - ILogger criado na Fase 1
   - Sabemos o padrão a seguir
   - Podemos criar estrutura consistente

2. **Precisamos Para Próximas Fases**
   - Cache Service precisa de interface
   - Token Service precisa de interface
   - Services precisam de interfaces

3. **Estrutura Organizada**
   - Criar pasta `src/core/interfaces/`
   - Organizar por domínio
   - Documentar cada interface

#### O Que Fazer

1. **Criar estrutura de pastas**
   ```
   src/core/interfaces/
   ├── logger.interface.ts          ✅ Já criado
   ├── cache.interface.ts           🆕 Criar
   ├── token.interface.ts           🆕 Criar
   └── index.ts                     🆕 Export centralizado
   ```

2. **Criar `ICacheService`**
   ```typescript
   export interface ICacheService {
     get<T>(key: string): Promise<T | null>;
     set(key: string, value: unknown, ttl: number): Promise<void>;
     invalidateByPattern(pattern: string): Promise<void>;
   }
   ```

3. **Criar `ITokenService`**
   ```typescript
   export interface ITokenService {
     sign(payload: JWTPayload): string;
     verify(token: string): JWTPayload;
   }
   ```

4. **Documentar interfaces**
   - JSDoc explicando propósito
   - Exemplos de uso
   - Quando usar cada uma

#### Resultado Esperado

- ✅ Estrutura de interfaces organizada
- ✅ Interfaces bem documentadas
- ✅ Pronto para usar nas próximas fases

#### Validação

- [ ] Interfaces criadas e tipadas corretamente
- [ ] Documentação completa
- [ ] Exports organizados

---

### 🔴 FASE 3: Refatorar Cache Service

**Duração:** 2-3 horas  
**Prioridade:** Crítica  
**Depende:** Fases 1 e 2 completas

#### Por Que Agora?

1. **Usa CircuitBreaker Desacoplado**
   - Já temos ILogger
   - Pode usar padrão estabelecido

2. **Bloqueia Testes de Services**
   - Services dependem de cache
   - Sem interface, não dá para mockar
   - Dificulta testes unitários

3. **Prepara Para DI**
   - Cache será injetado em Services
   - Precisa estar pronto antes

#### O Que Fazer

1. **Implementar `ICacheService` no cache-service**
   ```typescript
   export class RedisCacheService implements ICacheService {
     constructor(
       private redis: Redis,
       private logger: ILogger,
     ) {
       this.breaker = new CircuitBreaker(logger);
     }
     // Implementar métodos da interface
   }
   ```

2. **Criar factory function**
   ```typescript
   export function createCacheService(
     redis: Redis,
     logger: ILogger,
   ): ICacheService {
     return new RedisCacheService(redis, logger);
   }
   ```

3. **Manter compatibilidade temporária**
   ```typescript
   // TODO: Migrar para DI completo
   export const cache = createCacheService(redis, logger);
   ```

4. **Atualizar imports onde necessário**
   - Manter funcionando durante transição

#### Resultado Esperado

- ✅ Cache Service implementa interface
- ✅ Pode ser mockado em testes
- ✅ Pronto para injeção em Services
- ✅ Código existente continua funcionando

#### Validação

- [ ] Cache funciona normalmente
- [ ] Interface implementada corretamente
- [ ] Pode criar mock para testes
- [ ] Aplicação roda sem erros

---

### 🔴 FASE 4: Criar TokenService e Desacoplar Auth

**Duração:** 2-3 horas  
**Prioridade:** Crítica  
**Depende:** Fase 2 completa

#### Por Que Agora?

1. **Auth Service Precisa Desacoplar**
   - Atualmente recebe `FastifyInstance`
   - Viola separação de camadas
   - Dificulta testes

2. **Precisamos Para Testes**
   - Auth Service precisa ser testável
   - Sem abstração, não dá para mockar JWT

3. **Segue Padrão Estabelecido**
   - Mesmo padrão das fases anteriores
   - Consistência arquitetural

#### O Que Fazer

1. **Criar `JwtTokenService` implementando `ITokenService`**
   ```typescript
   export class JwtTokenService implements ITokenService {
     constructor(private jwt: FastifyJWT) {}
     
     sign(payload: JWTPayload): string {
       return this.jwt.sign(payload);
     }
     
     verify(token: string): JWTPayload {
       return this.jwt.verify(token);
     }
   }
   ```

2. **Refatorar `auth.service.ts`**
   - Remover parâmetro `app: FastifyInstance`
   - Adicionar `tokenService: ITokenService` no construtor
   - Converter de objeto para classe

3. **Atualizar `auth.routes.ts`**
   - Criar instância de TokenService
   - Passar para AuthService
   - Remover `app` dos métodos

4. **Criar factory ou instância**
   ```typescript
   // Em auth.routes.ts ou onde registrar
   const tokenService = new JwtTokenService(app.jwt);
   const authService = new AuthService(tokenService, usersService);
   ```

#### Resultado Esperado

- ✅ Auth Service desacoplado do Fastify
- ✅ Pode ser testado isoladamente
- ✅ TokenService pode ser mockado
- ✅ Separação de responsabilidades respeitada

#### Validação

- [ ] Auth funciona normalmente
- [ ] Login e registro funcionam
- [ ] Tokens gerados corretamente
- [ ] Pode criar mock de TokenService

---

### 🟡 FASE 5: Converter Services para Classes com DI

**Duração:** 4-6 horas  
**Prioridade:** Alta  
**Depende:** Fases 1-4 completas

#### Por Que Agora?

1. **Temos Todas as Interfaces**
   - ILogger ✅
   - ICacheService ✅
   - ITokenService ✅
   - Pronto para usar

2. **Precisamos Para Testes**
   - Services como objetos não permitem DI
   - Classes permitem injeção via construtor
   - Facilita mocking

3. **Padrão Consistente**
   - Todos Services seguem mesmo padrão
   - Código mais previsível
   - Facilita manutenção

#### O Que Fazer

**Para cada Service:**

1. **Converter de objeto para classe**
   ```typescript
   // ANTES
   export const usersService = {
     async findAll() { ... }
   };
   
   // DEPOIS
   export class UsersService {
     constructor(
       private cache: ICacheService,
       private repository: IUsersRepository,
     ) {}
     
     async findAll() { ... }
   }
   ```

2. **Injetar dependências via construtor**
   - Cache Service
   - Repositories
   - Outros Services (quando necessário)

3. **Criar instâncias onde necessário**
   - Em rotas ou em factory
   - Passar dependências

4. **Manter compatibilidade temporária**
   ```typescript
   // Export temporário para compatibilidade
   export const usersService = new UsersService(cache, usersRepository);
   ```

**Services a Refatorar:**
- ✅ `auth.service.ts` → `AuthService` (já feito na Fase 4)
- 🆕 `users.service.ts` → `UsersService`
- 🆕 Outros services conforme aparecerem

#### Resultado Esperado

- ✅ Todos Services são classes
- ✅ Dependências injetadas via construtor
- ✅ Fácil de testar e mockar
- ✅ Código mais limpo e organizado

#### Validação

- [ ] Todos Services funcionam normalmente
- [ ] Dependências injetadas corretamente
- [ ] Pode criar mocks para testes
- [ ] Aplicação roda sem erros

---

### 🟢 FASE 6: Extrair Magic Numbers para Constantes

**Duração:** 1-2 horas  
**Prioridade:** Média  
**Depende:** Pode ser paralelo às outras fases

#### Por Que Fazer?

1. **Manutenibilidade**
   - Valores centralizados
   - Fácil de ajustar
   - Documentado

2. **Clareza**
   - Nomes descritivos
   - Intenção clara
   - Não precisa adivinhar

3. **Consistência**
   - Mesmos valores em vários lugares
   - Evita inconsistências
   - Facilita mudanças

#### O Que Fazer

1. **Criar arquivo de constantes**
   ```typescript
   // src/core/shared/constants.ts
   export const CACHE_TTL = {
     USER_LIST: 60 * 5,        // 5 minutos
     USER_PROFILE: 60 * 10,    // 10 minutos
     GYM_LIST: 60 * 15,        // 15 minutos
   } as const;
   
   export const RATE_LIMIT = {
     GLOBAL: 50,
     AUTH: 5,
   } as const;
   
   export const CIRCUIT_BREAKER = {
     THRESHOLD: 5,
     RECOVERY_TIMEOUT: 30000,  // 30 segundos
   } as const;
   ```

2. **Substituir magic numbers**
   - Buscar por números hardcoded
   - Substituir por constantes
   - Documentar quando necessário

3. **Organizar por domínio**
   - Cache TTLs juntos
   - Rate limits juntos
   - Outros agrupados logicamente

#### Resultado Esperado

- ✅ Nenhum magic number no código
- ✅ Valores centralizados e documentados
- ✅ Fácil de ajustar e manter

#### Validação

- [ ] Todos magic numbers extraídos
- [ ] Constantes bem organizadas
- [ ] Documentação clara
- [ ] Código funciona normalmente

---

### 🟡 FASE 7: Criar DI Container Simples

**Duração:** 3-4 horas  
**Prioridade:** Alta  
**Depende:** Fases 1-5 completas

#### Por Que Criar DI Container?

1. **Centraliza Criação de Instâncias**
   - Um lugar para criar tudo
   - Evita duplicação
   - Facilita manutenção

2. **Gerencia Dependências**
   - Resolve dependências automaticamente
   - Evita criar manualmente
   - Reduz boilerplate

3. **Facilita Testes**
   - Pode substituir implementações
   - Fácil criar mocks
   - Isolamento melhor

#### Abordagem Pragmática (Sem Overengineering)

**NÃO vamos usar:**
- ❌ Bibliotecas pesadas (InversifyJS, TSyringe)
- ❌ Decorators complexos
- ❌ Metadados reflection
- ❌ Auto-discovery mágico

**VAMOS criar:**
- ✅ Container simples e explícito
- ✅ Factory functions claras
- ✅ Registro manual (previsível)
- ✅ Type-safe

#### O Que Fazer

1. **Criar container simples**
   ```typescript
   // src/core/di/container.ts
   export class DIContainer {
     private services = new Map<string, unknown>();
     
     register<T>(key: string, factory: () => T): void {
       this.services.set(key, factory);
     }
     
     resolve<T>(key: string): T {
       const factory = this.services.get(key);
       if (!factory) throw new Error(`Service ${key} not found`);
       return (factory as () => T)();
     }
   }
   ```

2. **Criar factory de serviços**
   ```typescript
   // src/core/di/service-factory.ts
   export function createServices(app: FastifyInstance) {
     const logger = new FastifyLoggerAdapter(app.log);
     const cache = createCacheService(redis, logger);
     const tokenService = new JwtTokenService(app.jwt);
     const usersRepository = new UsersRepository(prisma);
     const usersService = new UsersService(cache, usersRepository);
     const authService = new AuthService(tokenService, usersService);
     
     return {
       logger,
       cache,
       tokenService,
       usersRepository,
       usersService,
       authService,
     };
   }
   ```

3. **Usar em rotas**
   ```typescript
   // Em routes.config.ts ou similar
   const services = createServices(app);
   app.decorate('services', services);
   ```

#### Resultado Esperado

- ✅ DI Container simples e funcional
- ✅ Centraliza criação de instâncias
- ✅ Type-safe e previsível
- ✅ Fácil de usar e manter

#### Validação

- [ ] Container funciona corretamente
- [ ] Todas dependências resolvidas
- [ ] Aplicação roda sem erros
- [ ] Fácil de testar

---

### 🟡 FASE 8: Criar Interfaces para Repositories

**Duração:** 2-3 horas  
**Prioridade:** Alta  
**Depende:** Fase 5 completa

#### Por Que Fazer?

1. **Completar Desacoplamento**
   - Services já desacoplados
   - Repositories ainda acoplados
   - Completar arquitetura

2. **Facilita Testes**
   - Pode mockar repositories
   - Testes unitários de services
   - Isolamento completo

3. **Permite Trocar Implementação**
   - Pode trocar Prisma no futuro
   - Outros ORMs possíveis
   - Flexibilidade

#### O Que Fazer

1. **Criar interfaces para cada Repository**
   ```typescript
   // src/core/interfaces/repositories/users.repository.interface.ts
   export interface IUsersRepository {
     findByEmail(email: string): Promise<UserDTO | null>;
     findById(id: string): Promise<UserDTO | null>;
     create(data: CreateUserInput): Promise<UserDTO>;
     findAll(skip: number, take: number): Promise<UserDTO[]>;
     count(): Promise<number>;
   }
   ```

2. **Implementar interfaces nos Repositories**
   ```typescript
   export class UsersRepository implements IUsersRepository {
     constructor(private prisma: PrismaClient) {}
     // Implementar métodos
   }
   ```

3. **Atualizar Services**
   - Usar interfaces em vez de implementações
   - Injetar via construtor

#### Resultado Esperado

- ✅ Repositories desacoplados
- ✅ Interfaces bem definidas
- ✅ Fácil de testar e mockar
- ✅ Arquitetura completa

#### Validação

- [ ] Interfaces criadas
- [ ] Repositories implementam interfaces
- [ ] Services usam interfaces
- [ ] Tudo funciona normalmente

---

### 🔴 FASE 9: Configurar Infraestrutura de Testes

**Duração:** 4-6 horas  
**Prioridade:** Crítica  
**Depende:** Fases 1-8 completas (ou pelo menos principais)

#### Por Que Agora?

1. **Temos Código Testável**
   - Interfaces criadas
   - DI implementado
   - Desacoplamento completo
   - Pronto para testar

2. **Bloqueia Próximas Features**
   - Sem testes, não dá para garantir qualidade
   - Refatorações arriscadas
   - Bugs podem passar

3. **Base Para Tudo**
   - Testes são fundamentais
   - Precisa estar configurado antes
   - Facilita desenvolvimento

#### O Que Fazer

1. **Configurar banco de testes**
   - Banco isolado para testes
   - Setup/teardown automático
   - Migrations automáticas

2. **Criar factories e fixtures**
   - Factories para criar dados
   - Fixtures reutilizáveis
   - Helpers de teste

3. **Configurar coverage**
   - Thresholds adequados
   - Relatórios configurados
   - CI/CD integration

4. **Criar helpers de teste**
   - Build test app
   - Mock helpers
   - Assertions customizadas

#### Resultado Esperado

- ✅ Ambiente de testes completo
- ✅ Infraestrutura pronta
- ✅ Fácil escrever testes
- ✅ Coverage configurado

#### Validação

- [ ] Banco de testes funciona
- [ ] Factories criadas
- [ ] Helpers funcionando
- [ ] Coverage configurado

---

### 🔴 FASE 10: Implementar Testes Abrangentes

**Duração:** 2-3 semanas  
**Prioridade:** Crítica  
**Depende:** Fase 9 completa

#### Por Que Agora?

1. **Tudo Está Pronto**
   - Código testável
   - Infraestrutura configurada
   - Padrões estabelecidos

2. **Garantir Qualidade**
   - Cobertura alta
   - Confiança no código
   - Refatorações seguras

3. **Documentação Viva**
   - Testes documentam comportamento
   - Exemplos de uso
   - Especificação executável

#### O Que Fazer

**Ordem de Implementação:**

1. **Testes Unitários**
   - Circuit Breaker
   - Services (com mocks)
   - Utils e helpers

2. **Testes de Integração**
   - Repositories (com banco real)
   - Cache Service (com Redis)
   - Rotas HTTP

3. **Testes E2E**
   - Fluxos completos
   - Autenticação/autorização
   - Casos de uso principais

**Meta de Cobertura:** 80%+

#### Resultado Esperado

- ✅ Cobertura alta (80%+)
- ✅ Testes rápidos e confiáveis
- ✅ Confiança no código
- ✅ Refatorações seguras

#### Validação

- [ ] Coverage >80%
- [ ] Todos testes passando
- [ ] Testes rápidos (<30s total)
- [ ] CI/CD integrado

---

## 4. Decisões Arquiteturais

### 4.1 DI Container - Por Que Simples?

**Decisão:** Criar container simples em vez de biblioteca pesada

**Razões:**
- ✅ Menos dependências
- ✅ Mais controle
- ✅ Mais fácil de entender
- ✅ Type-safe nativo
- ✅ Sem magic/metadata

**Trade-offs:**
- ⚠️ Registro manual (mas previsível)
- ⚠️ Sem auto-discovery (mas explícito)

**Conclusão:** Pragmático e suficiente para nossas necessidades

### 4.2 Interfaces - Quando Criar?

**Decisão:** Criar interfaces conforme necessidade, não todas de uma vez

**Razões:**
- ✅ Evita overengineering
- ✅ Interfaces que realmente são usadas
- ✅ Coesão garantida
- ✅ Evolução gradual

**Critérios:**
- Precisa mockar? → Interface
- Múltiplas implementações? → Interface
- Desacoplar infraestrutura? → Interface

### 4.3 Classes vs Objetos - Por Que Classes?

**Decisão:** Converter Services de objetos para classes

**Razões:**
- ✅ Permite DI via construtor
- ✅ Mais fácil de testar
- ✅ Padrão consistente
- ✅ Type-safe melhor

**Trade-offs:**
- ⚠️ Mais verboso (mas mais claro)
- ⚠️ Precisa instanciar (mas centralizado)

---

## 5. Riscos e Mitigações

### 5.1 Risco: Breaking Changes

**Mitigação:**
- Manter compatibilidade temporária
- Migração gradual
- Testes antes e depois
- Commits pequenos e reversíveis

### 5.2 Risco: Overengineering

**Mitigação:**
- Criar abstrações apenas quando necessário
- Validar necessidade antes de criar
- Revisar regularmente
- Remover se não usar

### 5.3 Risco: Complexidade Excessiva

**Mitigação:**
- Manter simplicidade
- Documentar decisões
- Code review
- Refatorar se necessário

### 5.4 Risco: Tempo de Desenvolvimento

**Mitigação:**
- Priorizar itens críticos
- Fazer incrementalmente
- Validar cada passo
- Não tentar fazer tudo de uma vez

---

## 6. Critérios de Sucesso

### 6.1 Por Fase

Cada fase deve:
- ✅ Funcionar normalmente
- ✅ Não quebrar código existente
- ✅ Ser testável (quando aplicável)
- ✅ Estar documentada

### 6.2 Final

Ao final, teremos:
- ✅ Código 100% testável
- ✅ Coverage 80%+
- ✅ Zero acoplamentos desnecessários
- ✅ DI completo
- ✅ Interfaces bem definidas
- ✅ Código limpo e manutenível
- ✅ Pronto para escalar

---

## 7. Próximos Passos Após Roadmap

Após completar todas as fases:

1. **Otimizações**
   - Performance
   - Cache strategies
   - Query optimization

2. **Features**
   - Novos módulos
   - Funcionalidades de negócio
   - Integrações

3. **DX**
   - Generators
   - Templates
   - Documentação

4. **Observabilidade**
   - Métricas avançadas
   - Tracing
   - Alertas

---

**Última atualização:** Janeiro 2025  
**Status:** 🟢 Pronto para começar Fase 1

