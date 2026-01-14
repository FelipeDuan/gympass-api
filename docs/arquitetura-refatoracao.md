# Arquitetura de Refatoração - Auth e Users

## 🎯 Objetivo

Refatorar a arquitetura para:
- ✅ Manter separação de responsabilidades
- ✅ Evitar acoplamento direto entre módulos
- ✅ Eliminar duplicação de código
- ✅ Aproveitar cache e validações
- ✅ Código limpo e escalável

## 📊 Situação Atual

### Problemas Identificados

1. **Duplicação de Lógica**
   - `auth.service.register()` cria usuário sem cache
   - `users.service.create()` cria usuário com cache
   - Ambos fazem hash de senha e validação de email

2. **Responsabilidades Confusas**
   - Auth deveria focar em autenticação/autorização
   - Users deveria focar em CRUD de usuários
   - Mas ambos criam usuários

3. **Falta de Consistência**
   - Register não invalida cache
   - Create não gera token JWT
   - Diferentes retornos para mesma operação

## 🏗️ Arquitetura Proposta

### Princípios

1. **Separation of Concerns**: Cada módulo tem responsabilidade única
2. **Dependency Inversion**: Módulos dependem de abstrações, não implementações
3. **Single Responsibility**: Cada serviço faz uma coisa bem feita
4. **DRY (Don't Repeat Yourself)**: Lógica compartilhada em um lugar

### Estrutura Proposta

```
src/modules/
├── users/
│   ├── users.repository.ts      # Acesso a dados (Prisma)
│   ├── users.service.ts          # Lógica de negócio de usuários
│   ├── users.dto.ts              # DTOs e selects
│   ├── users.schemas.ts          # Schemas de validação
│   ├── users.serializers.ts      # Serialização de respostas
│   └── users.routes.ts           # Rotas HTTP
│
└── auth/
    ├── auth.repository.ts        # Acesso a dados específicos de auth
    ├── auth.service.ts           # Lógica de autenticação/autorização
    ├── auth.schemas.ts           # Schemas de validação
    └── auth.routes.ts             # Rotas HTTP
```

### Fluxo de Responsabilidades

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Layer (Routes)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /auth/register  →  auth.service.register()            │
│                              ↓                               │
│                         users.service.create()              │
│                              ↓                               │
│                         users.repository.create()            │
│                              ↓                               │
│                         cache.invalidate()                   │
│                              ↓                               │
│                         auth.service.generateToken()         │
│                                                               │
│  POST /users          →  users.service.create()             │
│                              ↓                               │
│                         users.repository.create()            │
│                              ↓                               │
│                         cache.invalidate()                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Refatoração Detalhada

### 1. Users Service (Core Domain)

**Responsabilidade**: Gerenciar ciclo de vida de usuários

```typescript
// users.service.ts
export const usersService = {
  /**
   * Cria um novo usuário
   * - Valida se email já existe
   * - Faz hash da senha
   * - Cria no banco
   * - Invalida cache
   * - Retorna usuário criado
   */
  async create(data: CreateUserInput): Promise<UserDTO> {
    // Validação + criação + cache
  },

  /**
   * Busca usuário por email (sem senha)
   */
  async findByEmail(email: string): Promise<UserDTO | null> {
    // Busca com cache se necessário
  },

  /**
   * Lista usuários paginados
   */
  async findAll(page: number, limit: number): Promise<PaginatedUsers> {
    // Lista com cache
  },
};
```

### 2. Auth Service (Application Service)

**Responsabilidade**: Orquestrar autenticação e autorização

```typescript
// auth.service.ts
export const authService = {
  /**
   * Registra novo usuário e retorna token
   * - Usa users.service.create() internamente
   * - Gera token JWT
   * - Retorna token + user
   */
  async register(
    app: FastifyInstance,
    data: RegisterSchema,
  ): Promise<{ token: string; user: UserDTO }> {
    // Delega criação para users.service
    const user = await usersService.create({
      name: data.name,
      email: data.email,
      password: data.password, // users.service faz hash
    });

    // Gera token
    const token = this.generateToken(app, user);

    return { token, user };
  },

  /**
   * Login de usuário existente
   * - Busca usuário com senha
   * - Valida senha
   * - Gera token
   */
  async login(
    app: FastifyInstance,
    data: LoginSchema,
  ): Promise<{ token: string; user: UserDTO }> {
    // Busca com senha via auth.repository
    // Valida senha
    // Gera token
  },

  /**
   * Gera token JWT
   */
  private generateToken(app: FastifyInstance, user: UserDTO): string {
    return app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  },
};
```

### 3. Auth Repository

**Responsabilidade**: Buscar dados específicos para autenticação

```typescript
// auth.repository.ts
export const authRepository = {
  /**
   * Busca usuário COM senha (apenas para autenticação)
   */
  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return await prisma.user.findUnique({
      where: { email },
      // Sem select - retorna tudo incluindo password_hash
    });
  },
};
```

## ✅ Vantagens desta Arquitetura

1. **Separação Clara**
   - Users: CRUD de usuários
   - Auth: Autenticação/Autorização

2. **Sem Duplicação**
   - Lógica de criação em um só lugar
   - Cache sempre invalida quando cria
   - Hash sempre feito da mesma forma

3. **Baixo Acoplamento**
   - Auth depende de Users (via service)
   - Não há dependência circular
   - Fácil de testar isoladamente

4. **Escalável**
   - Fácil adicionar novos casos de uso
   - Fácil adicionar novos módulos
   - Fácil mockar dependências

5. **Consistente**
   - Cache sempre atualizado
   - Validações sempre executadas
   - Retornos padronizados

## 🔄 Plano de Migração

### Passo 1: Refatorar users.service.create()
- [ ] Adicionar suporte a password (fazer hash)
- [ ] Manter invalidação de cache
- [ ] Retornar UserDTO completo

### Passo 2: Refatorar auth.service.register()
- [ ] Remover lógica de criação duplicada
- [ ] Usar users.service.create() internamente
- [ ] Manter geração de token
- [ ] Manter retorno com token + user

### Passo 3: Atualizar auth.repository
- [ ] Manter findByEmailWithPassword()
- [ ] Garantir que retorna password_hash

### Passo 4: Testes
- [ ] Testar register() usa cache corretamente
- [ ] Testar create() invalida cache
- [ ] Testar que não há duplicação

### Passo 5: Limpeza
- [ ] Remover código duplicado
- [ ] Atualizar documentação
- [ ] Revisar tipos

## 🎨 Exemplo Final

### users.service.ts
```typescript
export const usersService = {
  async create({ name, email, password }: CreateUserInput): Promise<UserDTO> {
    // Validação
    const exists = await usersRepository.findByEmail(email);
    if (exists) {
      throw new ConflictError('User with same email already exists.');
    }

    // Hash da senha
    const password_hash = await hash(password);

    // Criação
    const user = await usersRepository.create({
      name,
      email,
      password_hash,
    });

    // Cache
    await cache.invalidateByPattern('users:list:*');

    return user;
  },
};
```

### auth.service.ts
```typescript
export const authService = {
  async register(
    app: FastifyInstance,
    data: RegisterSchema,
  ): Promise<{ token: string; user: UserDTO }> {
    // Delega criação para users.service
    const user = await usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Gera token
    const token = app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user };
  },
};
```

## 📝 Decisões de Design

### ✅ Auth usa Users Service
**Por quê?**
- Register é um caso de uso de autenticação que cria usuário
- Mantém lógica de criação em um só lugar
- Cache sempre funciona corretamente

### ✅ Users Service não conhece Auth
**Por quê?**
- Users é domínio core, não deve depender de auth
- Mantém baixo acoplamento
- Facilita testes

### ✅ Auth Repository separado
**Por quê?**
- Precisa buscar password_hash (não deve estar em UserDTO)
- Segurança: password_hash não deve vazar em UserDTO
- Separação de responsabilidades

## 🚀 Próximos Passos

1. Implementar refatoração seguindo este plano
2. Adicionar testes unitários
3. Adicionar testes de integração
4. Documentar decisões arquiteturais
5. Revisar com time

