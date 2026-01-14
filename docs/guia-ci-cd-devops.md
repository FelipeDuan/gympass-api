# 🚀 Guia Completo: CI/CD e DevOps

## 📚 Índice

1. [Conceitos Fundamentais](#conceitos-fundamentais)
2. [Estrutura de Ambientes](#estrutura-de-ambientes)
3. [GitHub Actions - Workflows](#github-actions---workflows)
4. [Estratégias de Deploy](#estratégias-de-deploy)
5. [Versionamento e Controle](#versionamento-e-controle)
6. [Rollback e Recuperação](#rollback-e-recuperação)
7. [Segurança em CI/CD](#segurança-em-cicd)
8. [Próximos Passos](#próximos-passos)

---

## 🎯 Conceitos Fundamentais

### O que é CI/CD?

**CI (Continuous Integration - Integração Contínua)**
- Integra código automaticamente várias vezes ao dia
- Executa testes automaticamente
- Detecta problemas cedo
- Garante que o código sempre funciona

**CD (Continuous Deployment/Delivery - Deploy Contínuo)**
- **Delivery**: Código está sempre pronto para produção
- **Deployment**: Código vai automaticamente para produção

### Por que usar CI/CD?

✅ **Detecção precoce de bugs**
✅ **Deploy mais rápido e seguro**
✅ **Menos erros manuais**
✅ **Histórico completo de mudanças**
✅ **Rollback fácil**
✅ **Confiança no código**

### Tecnologias Principais

| Tecnologia | Propósito | Quando Usar |
|------------|-----------|-------------|
| **GitHub Actions** | CI/CD nativo do GitHub | ✅ Recomendado para seu projeto |
| **Docker** | Containerização | ✅ Já tem docker-compose |
| **Kubernetes** | Orquestração de containers | ⚠️ Para projetos grandes |
| **Terraform** | Infraestrutura como código | ⚠️ Para múltiplos ambientes |
| **Ansible** | Automação de configuração | ⚠️ Para servidores físicos |

---

## 🌍 Estrutura de Ambientes

### Estrutura Recomendada (3 Ambientes)

```
┌─────────────────────────────────────────────────┐
│  DESENVOLVIMENTO (dev)                          │
│  - Desenvolvedor trabalha localmente            │
│  - Hot reload, debug fácil                      │
│  - Sem restrições de segurança                  │
└─────────────────────────────────────────────────┘
                    ↓ (push para branch)
┌─────────────────────────────────────────────────┐
│  STAGING (staging)                              │
│  - Testa como se fosse produção                 │
│  - Testes de integração completos               │
│  - Validação de segurança                       │
│  - Testes de performance                        │
└─────────────────────────────────────────────────┘
                    ↓ (aprovado, merge para main)
┌─────────────────────────────────────────────────┐
│  PRODUÇÃO (production)                          │
│  - Ambiente real, usuários reais                 │
│  - Monitoramento ativo                          │
│  - Backups automáticos                          │
│  - Rollback rápido                              │
└─────────────────────────────────────────────────┘
```

### Diferenças entre Ambientes

| Aspecto | Dev | Staging | Production |
|---------|-----|---------|------------|
| **Banco de Dados** | Local/Docker | Cópia de prod | Real |
| **Logs** | Verbose | Normal | Apenas erros |
| **CSP** | Permissivo | Restritivo | Máximo |
| **Rate Limit** | Alto | Médio | Baixo |
| **Swagger** | ✅ Sim | ✅ Sim | ❌ Não |
| **Testes** | Unitários | Integração | Monitoramento |

---

## 🔄 GitHub Actions - Workflows

### Estrutura de um Workflow

```yaml
name: Nome do Workflow

on:
  trigger: # Quando executar

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Nome do passo
        run: comando
```

### Workflow 1: CI (Integração Contínua)

**Quando executar:**
- Push em qualquer branch
- Pull Request aberto/atualizado

**O que fazer:**
1. ✅ Instalar dependências
2. ✅ Lint (verificar código)
3. ✅ Type check (verificar tipos)
4. ✅ Testes unitários
5. ✅ Coverage (cobertura de testes)
6. ✅ Build (compilar)

**Arquivo:** `.github/workflows/ci.yml`

```yaml
name: CI - Continuous Integration

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['main', 'develop']

jobs:
  lint-and-test:
    name: Lint, Type Check & Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: gympass_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Instalar pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Instalar dependências
        run: pnpm install --frozen-lockfile

      - name: Gerar Prisma Client
        run: pnpm db:generate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/gympass_test

      - name: Rodar migrations
        run: pnpm db:migrate:deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/gympass_test

      - name: Lint
        run: pnpm lint

      - name: Type Check
        run: pnpm typecheck

      - name: Testes com Coverage
        run: pnpm test:cov
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/gympass_test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
          JWT_SECRET: test-secret-key-minimum-32-characters-long
          NODE_ENV: test

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Build
        run: pnpm build
```

### Workflow 2: Staging (Deploy para Teste)

**Quando executar:**
- Merge para branch `develop` ou `staging`
- Manualmente (workflow_dispatch)

**O que fazer:**
1. ✅ Executar CI completo
2. ✅ Build da aplicação
3. ✅ Build do Docker image
4. ✅ Push para registry (Docker Hub/GitHub Container Registry)
5. ✅ Deploy para ambiente de staging
6. ✅ Rodar testes de integração
7. ✅ Health check

**Arquivo:** `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy Staging

on:
  push:
    branches: ['develop', 'staging']
  workflow_dispatch: # Permite executar manualmente

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-deploy:
    name: Build & Deploy to Staging
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Instalar pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Instalar dependências
        run: pnpm install --frozen-lockfile

      - name: Build aplicação
        run: pnpm build

      - name: Login no GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:staging-${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:staging-latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy para Staging
        # Aqui você conectaria com seu servidor de staging
        # Exemplo: SSH, Kubernetes, Cloud Provider
        run: |
          echo "Deploy para staging..."
          # docker-compose -f docker-compose.staging.yml up -d
          # ou kubectl apply -f k8s/staging/
          # ou terraform apply -var-file=staging.tfvars

      - name: Health Check
        run: |
          echo "Aguardando aplicação iniciar..."
          sleep 30
          curl -f http://staging.example.com/health || exit 1

      - name: Testes de Integração
        run: |
          echo "Rodando testes de integração..."
          # pnpm test:integration
```

### Workflow 3: Production (Deploy para Produção)

**Quando executar:**
- Merge para branch `main`
- Manualmente com aprovação (workflow_dispatch)

**O que fazer:**
1. ✅ Executar CI completo
2. ✅ Build da aplicação
3. ✅ Build do Docker image
4. ✅ Push para registry com tag de versão
5. ✅ **Aguardar aprovação manual** (opcional, mas recomendado)
6. ✅ Deploy para produção (blue-green ou rolling)
7. ✅ Health check
8. ✅ Smoke tests
9. ✅ Notificação (Slack, email, etc.)

**Arquivo:** `.github/workflows/deploy-production.yml`

```yaml
name: Deploy Production

on:
  push:
    branches: ['main']
  workflow_dispatch:
    inputs:
      version:
        description: 'Versão para deploy (ex: 1.2.3)'
        required: true
        type: string

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  VERSION: ${{ github.event.inputs.version || github.ref_name }}

jobs:
  build:
    name: Build Production Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Instalar pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Instalar dependências
        run: pnpm install --frozen-lockfile

      - name: Build aplicação
        run: pnpm build

      - name: Login no GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build e Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Criar Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ env.VERSION }}
          release_name: Release v${{ env.VERSION }}
          draft: false
          prerelease: false

  deploy:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://api.gympass.com

    steps:
      - name: Deploy para Produção
        run: |
          echo "Deployando versão ${{ env.VERSION }}..."
          # Implementar estratégia de deploy (blue-green, rolling, etc.)

      - name: Health Check
        run: |
          echo "Verificando saúde da aplicação..."
          for i in {1..10}; do
            if curl -f https://api.gympass.com/health; then
              echo "✅ Aplicação saudável!"
              exit 0
            fi
            echo "Tentativa $i/10..."
            sleep 10
          done
          echo "❌ Health check falhou!"
          exit 1

      - name: Smoke Tests
        run: |
          echo "Rodando smoke tests..."
          # Testes básicos para garantir que tudo funciona
          # curl -f https://api.gympass.com/api/health
          # curl -f https://api.gympass.com/docs

      - name: Notificar Sucesso
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "✅ Deploy para produção concluído com sucesso!",
              attachments: [{
                color: 'good',
                text: `Versão: ${{ env.VERSION }}\nCommit: ${{ github.sha }}`
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notificar Falha
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "❌ Deploy para produção falhou!",
              attachments: [{
                color: 'danger',
                text: `Versão: ${{ env.VERSION }}\nCommit: ${{ github.sha }}`
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🚀 Estratégias de Deploy

### 1. Blue-Green Deployment

**Como funciona:**
- Mantém 2 ambientes idênticos (blue e green)
- Deploy na versão "inativa"
- Testa na versão inativa
- Troca o tráfego instantaneamente
- Mantém versão antiga pronta para rollback

**Vantagens:**
✅ Zero downtime
✅ Rollback instantâneo
✅ Teste antes de trocar

**Desvantagens:**
❌ Precisa de 2x recursos
❌ Mais complexo

### 2. Rolling Deployment

**Como funciona:**
- Atualiza containers/servidores gradualmente
- Um por vez ou em grupos pequenos
- Mantém serviço sempre disponível

**Vantagens:**
✅ Usa recursos normais
✅ Zero downtime
✅ Rollback possível

**Desvantagens:**
❌ Versões diferentes rodando simultaneamente
❌ Pode causar inconsistências temporárias

### 3. Canary Deployment

**Como funciona:**
- Deploy para pequeno % de usuários (5-10%)
- Monitora métricas
- Se tudo OK, expande gradualmente
- Se problemas, rollback imediato

**Vantagens:**
✅ Testa com usuários reais
✅ Reduz risco
✅ Rollback rápido

**Desvantagens:**
❌ Mais complexo
❌ Precisa de monitoramento

### Recomendação para seu projeto:

**Começar com:** Rolling Deployment (mais simples)
**Evoluir para:** Blue-Green (quando crescer)
**Considerar:** Canary (quando tiver muitos usuários)

---

## 🏷️ Versionamento e Controle

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (patch: bug fix)
1.0.1 → 1.1.0 (minor: nova feature)
1.1.0 → 2.0.0 (major: breaking change)
```

### Tags no Git

```bash
# Criar tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Listar tags
git tag -l

# Ver diferenças entre versões
git diff v1.0.0 v1.1.0
```

### Changelog Automático

**Ferramenta:** `conventional-changelog`

```bash
pnpm add -D conventional-changelog-cli
```

**Uso:**
```bash
# Gerar changelog automaticamente
pnpm changelog
```

**Formato de commits:**
```
feat: adiciona autenticação JWT
fix: corrige bug no rate limiting
docs: atualiza README
chore: atualiza dependências
```

---

## 🔙 Rollback e Recuperação

### Estratégias de Rollback

#### 1. Rollback Automático

```yaml
- name: Health Check com Rollback
  run: |
    if ! curl -f https://api.gympass.com/health; then
      echo "❌ Health check falhou! Fazendo rollback..."
      # Reverter para versão anterior
      kubectl rollout undo deployment/api
      # ou docker-compose down && docker-compose up -d com versão anterior
      exit 1
    fi
```

#### 2. Rollback Manual

```bash
# Kubernetes
kubectl rollout undo deployment/api

# Docker Compose
docker-compose down
docker-compose -f docker-compose.prod.yml up -d --image=ghcr.io/user/repo:v1.0.0

# Git (se usar GitOps)
git revert HEAD
git push origin main
```

### Backup e Restore

**Banco de Dados:**
```bash
# Backup antes de deploy
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore em caso de problema
psql $DATABASE_URL < backup_20250114_120000.sql
```

**Docker Images:**
```bash
# Manter versões antigas no registry
# GitHub Container Registry mantém histórico
# Sempre tag com versão específica, não só 'latest'
```

---

## 🔒 Segurança em CI/CD

### Secrets Management

**GitHub Secrets:**
- Não commitar senhas no código
- Usar `${{ secrets.NOME_SECRET }}`
- Rotacionar secrets regularmente

**Secrets importantes:**
- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_PASSWORD`
- `DOCKER_REGISTRY_TOKEN`
- `SLACK_WEBHOOK`
- `AWS_ACCESS_KEY_ID` (se usar AWS)

### Security Scanning

**Dependências:**
```yaml
- name: Scan dependências
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**Código:**
```yaml
- name: Security Scan
  uses: github/super-linter@v4
```

**Docker Images:**
```yaml
- name: Scan Docker Image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
```

### Branch Protection

**Configurar no GitHub:**
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Do not allow force pushes
- Do not allow deletions

---

## 📊 Monitoramento e Alertas

### Métricas Importantes

1. **Performance:**
   - Tempo de resposta
   - Throughput (req/s)
   - Latência p95, p99

2. **Disponibilidade:**
   - Uptime %
   - Health check status
   - Error rate

3. **Recursos:**
   - CPU usage
   - Memory usage
   - Disk usage

### Ferramentas Recomendadas

| Ferramenta | Propósito | Custo |
|------------|-----------|-------|
| **Prometheus** | Métricas | Gratuito |
| **Grafana** | Dashboards | Gratuito |
| **Sentry** | Error tracking | Freemium |
| **Datadog** | APM completo | Pago |
| **New Relic** | APM completo | Pago |

---

## 🎯 Próximos Passos

### Fase 1: Básico (Começar Aqui) ✅

1. ✅ Criar workflow de CI
2. ✅ Configurar testes automatizados
3. ✅ Adicionar lint e type check
4. ✅ Configurar coverage

### Fase 2: Intermediário

1. ⏳ Criar Dockerfile otimizado
2. ⏳ Configurar GitHub Container Registry
3. ⏳ Criar workflow de staging
4. ⏳ Adicionar health check endpoint

### Fase 3: Avançado

1. ⏳ Implementar deploy para produção
2. ⏳ Configurar monitoramento
3. ⏳ Adicionar alertas
4. ⏳ Implementar rollback automático

### Fase 4: Expert

1. ⏳ Blue-green deployment
2. ⏳ Canary releases
3. ⏳ Auto-scaling
4. ⏳ Multi-region deployment

---

## 📝 Checklist de Implementação

### CI/CD Básico
- [ ] Workflow de CI configurado
- [ ] Testes rodando automaticamente
- [ ] Lint e type check automáticos
- [ ] Coverage report gerado
- [ ] Build funcionando

### Deploy Staging
- [ ] Dockerfile criado
- [ ] Docker image buildando
- [ ] Registry configurado
- [ ] Deploy automático para staging
- [ ] Health check funcionando

### Deploy Production
- [ ] Workflow de produção criado
- [ ] Aprovação manual configurada
- [ ] Versionamento automático
- [ ] Rollback testado
- [ ] Notificações configuradas

### Segurança
- [ ] Secrets configurados
- [ ] Security scanning ativo
- [ ] Branch protection ativado
- [ ] Dependências atualizadas

### Monitoramento
- [ ] Health check endpoint
- [ ] Logs centralizados
- [ ] Métricas coletadas
- [ ] Alertas configurados

---

## 🎓 Recursos para Aprender Mais

### Documentação Oficial
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)

### Cursos Recomendados
- **GitHub Actions:** GitHub Learning Lab
- **Docker:** Docker Official Tutorial
- **Kubernetes:** Kubernetes Basics (oficial)

### Livros
- "The DevOps Handbook"
- "Continuous Delivery"
- "Site Reliability Engineering"

---

## 💡 Dicas Finais

1. **Comece simples:** Implemente CI primeiro, depois CD
2. **Teste localmente:** Use `act` para testar GitHub Actions localmente
3. **Documente tudo:** Cada workflow deve ter comentários claros
4. **Versionamento:** Sempre use tags semânticas
5. **Monitoramento:** Não deploy sem monitoramento
6. **Rollback:** Sempre tenha plano de rollback
7. **Segurança:** Nunca commite secrets
8. **Iteração:** Melhore gradualmente, não tente fazer tudo de uma vez

---

**Próximo passo:** Implementar workflow de CI básico! 🚀

