# 📝 Sequência de Commits - Organização do Desenvolvimento

## 🎯 Contexto

**Onde estávamos:** Fase 2 - Segurança Crítica (Headers e Configurações) ✅  
**O que fizemos:** Implementamos CI/CD, Health Check e Monitoramento  
**Próximo passo:** Organizar commits e reestabelecer prioridades

---

## 📋 Sequência de Commits Recomendada

### **Grupo 1: Refatoração de Estrutura (Health e Monitoring)**

#### Commit 1: refactor: mover módulos health e monitoring para estrutura de modules
**Tipo:** `refactor`  
**Escopo:** `structure`  
**Arquivos:**
- `src/http/health/health.routes.ts` → `src/modules/health/health.routes.ts`
- `src/http/health/health.service.ts` → `src/modules/health/health.service.ts`
- `src/http/health/health.schemas.ts` → `src/modules/health/health.schemas.ts`
- `src/http/monitoring/monitoring.routes.ts` → `src/modules/monitoring/monitoring.routes.ts`
- `src/http/monitoring/monitoring.service.ts` → `src/modules/monitoring/monitoring.service.ts`
- `src/http/monitoring/monitoring.schemas.ts` → `src/modules/monitoring/monitoring.schemas.ts`
- `src/config/plugins/routes.config.ts` (atualizar imports)

**Mensagem:**
```
refactor(structure): mover health e monitoring para modules

- Move health check para src/modules/health
- Move monitoring para src/modules/monitoring
- Atualiza imports em routes.config.ts
- Mantém consistência com estrutura de módulos (auth, users)
```

---

### **Grupo 2: Configuração e Infraestrutura**

#### Commit 2: build: atualizar Dockerfile para Node.js 22
**Tipo:** `build`  
**Escopo:** `docker`  
**Arquivos:**
- `Dockerfile`

**Mensagem:**
```
build(docker): atualizar para Node.js 22

- Atualiza builder stage para node:22-alpine
- Atualiza runner stage para node:22-alpine
- Mantém compatibilidade com versões anteriores
```

---

#### Commit 3: ci: adicionar workflow de CI com Node.js 22 e PostgreSQL 17
**Tipo:** `ci`  
**Escopo:** `github-actions`  
**Arquivos:**
- `.github/workflows/ci.yml`

**Mensagem:**
```
ci: adicionar workflow de CI

- Configura CI com Node.js 22
- Usa PostgreSQL 17 para testes
- Inclui lint, type check, testes e build
- Adiciona upload de coverage para Codecov
```

---

#### Commit 4: ci: adicionar workflow de deploy para staging
**Tipo:** `ci`  
**Escopo:** `deploy`  
**Arquivos:**
- `.github/workflows/deploy-staging.yml`

**Mensagem:**
```
ci: adicionar workflow de deploy para staging

- Build e push de Docker image para staging
- Tags: staging-{sha} e staging-latest
- Health check opcional após deploy
- Suporta deploy manual via workflow_dispatch
```

---

#### Commit 5: ci: adicionar workflow de deploy para produção
**Tipo:** `ci`  
**Escopo:** `deploy`  
**Arquivos:**
- `.github/workflows/deploy-production.yml`

**Mensagem:**
```
ci: adicionar workflow de deploy para produção

- Testes obrigatórios antes de deploy
- Build e push de Docker image com versionamento
- Criação automática de Release para tags
- Health check e smoke tests após deploy
- Notificações de sucesso/falha
```

---

#### Commit 6: build: adicionar .dockerignore para otimizar builds
**Tipo:** `build`  
**Escopo:** `docker`  
**Arquivos:**
- `.dockerignore`

**Mensagem:**
```
build(docker): adicionar .dockerignore

- Ignora node_modules, build, coverage
- Ignora arquivos de desenvolvimento (.env, docs)
- Ignora arquivos de IDE e Git
- Reduz tamanho do contexto de build
```

---

### **Grupo 3: Features - Health Check**

#### Commit 7: feat(health): implementar health check endpoint
**Tipo:** `feat`  
**Escopo:** `health`  
**Arquivos:**
- `src/modules/health/health.schemas.ts`
- `src/modules/health/health.service.ts`
- `src/modules/health/health.routes.ts`

**Mensagem:**
```
feat(health): implementar health check endpoint

- Adiciona endpoint GET /health
- Verifica conexão com PostgreSQL
- Verifica conexão com Redis
- Retorna tempo de resposta de cada serviço
- Retorna status HTTP 200 (healthy) ou 503 (unhealthy)
- Inclui uptime e timestamp
```

---

### **Grupo 4: Features - Monitoramento**

#### Commit 8: feat(monitoring): implementar sistema de métricas básico
**Tipo:** `feat`  
**Escopo:** `monitoring`  
**Arquivos:**
- `src/infra/monitoring/metrics.ts`

**Mensagem:**
```
feat(monitoring): implementar coletor de métricas

- Coleta métricas de requisições por rota
- Calcula tempo médio de resposta
- Calcula taxa de erro
- Armazena métricas em memória
- Suporta reset de métricas
```

---

#### Commit 9: feat(monitoring): adicionar endpoint de métricas
**Tipo:** `feat`  
**Escopo:** `monitoring`  
**Arquivos:**
- `src/modules/monitoring/monitoring.schemas.ts`
- `src/modules/monitoring/monitoring.service.ts`
- `src/modules/monitoring/monitoring.routes.ts`
- `src/config/plugins/routes.config.ts` (adicionar middleware de métricas)

**Mensagem:**
```
feat(monitoring): adicionar endpoint GET /metrics

- Endpoint disponível apenas em dev/staging
- Retorna métricas formatadas de todas as rotas
- Inclui contagem, tempo médio, erros e taxa de erro
- Middleware automático coleta métricas de todas as requisições
```

---

### **Grupo 5: Documentação**

#### Commit 10: docs: adicionar guia completo de CI/CD e DevOps
**Tipo:** `docs`  
**Escopo:** `cicd`  
**Arquivos:**
- `docs/guia-ci-cd-devops.md`

**Mensagem:**
```
docs: adicionar guia completo de CI/CD e DevOps

- Explica conceitos de CI/CD
- Documenta estrutura de ambientes
- Inclui exemplos de workflows GitHub Actions
- Explica estratégias de deploy
- Documenta versionamento e rollback
- Inclui seção de segurança em CI/CD
```

---

#### Commit 11: docs: adicionar resumo da implementação CI/CD
**Tipo:** `docs`  
**Escopo:** `cicd`  
**Arquivos:**
- `docs/resumo-implementacao-cicd.md`

**Mensagem:**
```
docs: adicionar resumo da implementação CI/CD

- Documenta health check endpoint
- Documenta sistema de monitoramento
- Explica workflows criados
- Inclui instruções de uso
- Lista próximos passos opcionais
```

---

#### Commit 12: docs: adicionar sequência de commits recomendada
**Tipo:** `docs`  
**Escopo:** `git`  
**Arquivos:**
- `docs/sequencia-commits.md`

**Mensagem:**
```
docs: adicionar sequência de commits recomendada

- Organiza commits em grupos lógicos
- Segue conventional commits
- Facilita revisão e histórico
- Documenta contexto do desenvolvimento
```

---

## 🎯 Resumo da Sequência

### Total de Commits: 12

**Grupos:**
1. **Refatoração** (1 commit) - Estrutura
2. **Infraestrutura** (5 commits) - Docker, CI/CD
3. **Features** (3 commits) - Health Check e Monitoramento
4. **Documentação** (3 commits) - Guias e resumos

---

## 📊 Ordem de Execução Recomendada

```
1. refactor: mover módulos (estrutura)
   ↓
2. build: Dockerfile (infra)
   ↓
3. ci: workflows (infra)
   ↓
4. feat: health check (feature)
   ↓
5. feat: monitoramento (feature)
   ↓
6. docs: documentação (docs)
```

---

## ✅ Checklist Antes de Commitar

Para cada commit, verificar:

- [ ] Código compila sem erros (`pnpm typecheck`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Testes passam (`pnpm test`)
- [ ] Mensagem de commit segue conventional commits
- [ ] Arquivos relacionados estão no mesmo commit
- [ ] Não há arquivos temporários ou de debug

---

## 🔄 Próximos Passos Após Commits

1. **Revisar histórico:** `git log --oneline` para verificar organização
2. **Testar workflows:** Fazer push e verificar GitHub Actions
3. **Reestabelecer prioridades:** Retomar Fase 2 do guia de planejamento
4. **Continuar desenvolvimento:** Seguir próximas fases do guia

---

## 📝 Convenções de Commits

Seguindo [Conventional Commits](https://www.conventionalcommits.org/):

**Formato:**
```
<tipo>(<escopo>): <descrição curta>

<corpo opcional (mais detalhes)>

<rodapé opcional>
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração de código
- `build`: Mudanças no build/CI
- `ci`: Mudanças em CI/CD
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `test`: Testes
- `chore`: Tarefas de manutenção

**Escopos sugeridos:**
- `health`, `monitoring`, `auth`, `users`
- `docker`, `cicd`, `structure`
- `security`, `performance`

---

## 🎓 Dicas

1. **Commits pequenos:** Um commit = uma mudança lógica
2. **Mensagens claras:** Explique o "o quê" e "por quê"
3. **Testar antes:** Sempre testar antes de commitar
4. **Revisar:** Use `git diff` para revisar mudanças
5. **Histórico limpo:** Commits organizados facilitam debugging

---

**Status:** ✅ Sequência pronta para execução!

