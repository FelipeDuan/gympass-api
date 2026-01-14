# 🔧 Variáveis de Ambiente

## 📋 Lista Completa de Variáveis

### Obrigatórias

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `DATABASE_URL` | string | URL de conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | string | Secret para assinar tokens (min 32 chars) | `your-secret-key-here` |

### Opcionais (com valores padrão)

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `NODE_ENV` | enum | `dev` | Ambiente: `dev`, `test`, `production` |
| `PORT` | number | `3100` | Porta do servidor |
| `REDIS_HOST` | string | `127.0.0.1` | Host do Redis |
| `REDIS_PORT` | number | `6379` | Porta do Redis |
| `JWT_EXPIRES_IN` | string | `7d` | Expiração do token (ex: `1h`, `7d`) |
| `CORS_ORIGINS` | string | `*` | Origens permitidas (separadas por vírgula) |

---

## 🚀 Setup Rápido

### 1. Copiar arquivo de exemplo

```bash
cp .env.example .env
```

### 2. Configurar variáveis obrigatórias

**DATABASE_URL:**
```env
# Com Docker Compose (padrão)
DATABASE_URL=postgresql://docker:docker@localhost:5432/gympass

# PostgreSQL local
DATABASE_URL=postgresql://postgres:senha@localhost:5432/gympass

# PostgreSQL remoto
DATABASE_URL=postgresql://user:pass@host:5432/database
```

**JWT_SECRET:**
```bash
# Gerar secret seguro (Linux/Mac)
openssl rand -base64 32

# Ou usar um gerador online
# https://generate-secret.vercel.app/32
```

```env
JWT_SECRET=seu-secret-gerado-aqui-com-pelo-menos-32-caracteres
```

### 3. Configurar variáveis opcionais (se necessário)

**CORS_ORIGINS (para produção):**
```env
# Permitir apenas origens específicas
CORS_ORIGINS=https://app.example.com,https://admin.example.com

# Desenvolvimento (permitir tudo)
CORS_ORIGINS=*
```

---

## 🔒 Segurança

### ⚠️ NUNCA commite o `.env`!

O `.env` está no `.gitignore` e não deve ser commitado.

### ✅ O que commitar:

- ✅ `.env.example` - Template com valores de exemplo
- ✅ `docs/variaveis-ambiente.md` - Esta documentação

### ❌ O que NÃO commitar:

- ❌ `.env` - Arquivo com valores reais
- ❌ `.env.local` - Arquivo local
- ❌ `.env.production` - Arquivo de produção

---

## 📝 Exemplos por Ambiente

### Desenvolvimento (dev)

```env
NODE_ENV=dev
PORT=3100
DATABASE_URL=postgresql://docker:docker@localhost:5432/gympass
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=dev-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGINS=*
```

### Testes (test)

```env
NODE_ENV=test
PORT=3100
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gympass_test
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=test-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=1h
CORS_ORIGINS=*
```

### Produção (production)

```env
NODE_ENV=production
PORT=3100
DATABASE_URL=postgresql://user:strong-password@db.example.com:5432/gympass_prod
REDIS_HOST=redis.example.com
REDIS_PORT=6379
JWT_SECRET=super-secure-production-secret-minimum-32-chars
JWT_EXPIRES_IN=24h
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

---

## 🐳 Docker Compose

Se estiver usando Docker Compose, as configurações padrão são:

```yaml
# docker-compose.yml
services:
  postgres:
    # Usuário: docker
    # Senha: docker
    # Database: gympass
    # Porta: 5432
    
  redis:
    # Porta: 6379
```

**DATABASE_URL correspondente:**
```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/gympass
```

---

## ✅ Validação

O projeto valida automaticamente as variáveis de ambiente ao iniciar:

- ✅ Tipo correto
- ✅ Valores obrigatórios presentes
- ✅ Formato correto (ex: DATABASE_URL deve ser URL válida)
- ✅ Tamanho mínimo (ex: JWT_SECRET mínimo 32 caracteres)

Se houver erro, a aplicação não inicia e mostra mensagem de erro detalhada.

---

## 🔍 Troubleshooting

### Erro: "Invalid environment variables"

**Causa:** Variável faltando ou formato incorreto

**Solução:**
1. Verifique se todas as variáveis obrigatórias estão presentes
2. Verifique o formato (ex: DATABASE_URL deve começar com `postgresql://`)
3. Verifique tamanhos mínimos (ex: JWT_SECRET mínimo 32 caracteres)

### Erro: "Cannot resolve environment variable: DATABASE_URL"

**Causa:** Arquivo `.env` não existe ou variável não está definida

**Solução:**
1. Copie `.env.example` para `.env`
2. Configure as variáveis obrigatórias
3. Reinicie a aplicação

### CORS bloqueando requisições

**Causa:** Origem não está na lista `CORS_ORIGINS`

**Solução:**
1. Adicione a origem à lista em `CORS_ORIGINS`
2. Ou use `CORS_ORIGINS=*` em desenvolvimento
3. Reinicie a aplicação

---

**Última atualização:** Janeiro 2025

