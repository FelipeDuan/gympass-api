# 📖 Como Usar o Arquivo .cursorrules

**Guia completo sobre como o Cursor AI reconhece e usa as regras do projeto**

---

## 🎯 Como Funciona

O Cursor AI reconhece automaticamente arquivos de regras em dois níveis:

1. **Regras do Projeto** (`.cursorrules` na raiz) - Específicas para este projeto
2. **Regras Globais do Usuário** - Aplicadas a todos os projetos

---

## 📁 Opção 1: Regras do Projeto (Atual - Recomendado)

### ✅ Status Atual

O arquivo `.cursorrules` já está configurado corretamente na raiz do projeto:

```
api-solid/
├── .cursorrules          ← ✅ Já está aqui!
├── src/
├── package.json
└── ...
```

### Como Funciona

- ✅ **Reconhecimento Automático:** O Cursor AI detecta automaticamente o arquivo `.cursorrules` na raiz
- ✅ **Aplicação Automática:** As regras são aplicadas automaticamente quando você trabalha neste projeto
- ✅ **Específico do Projeto:** Cada projeto pode ter suas próprias regras
- ✅ **Versionado no Git:** As regras são versionadas junto com o código

### Vantagens

- ✅ Regras específicas para cada projeto
- ✅ Time inteiro usa as mesmas regras (via Git)
- ✅ Evolução das regras junto com o projeto
- ✅ Não afeta outros projetos

### Quando Usar

- ✅ **Sempre** para regras específicas do projeto
- ✅ Quando você quer que o time inteiro use as mesmas regras
- ✅ Quando as regras são parte da arquitetura do projeto

---

## 🌐 Opção 2: Regras Globais do Usuário

### Quando Usar Regras Globais

Use regras globais para padrões que você quer aplicar em **TODOS** os seus projetos, como:

- Convenções pessoais de código
- Preferências de estilo
- Padrões gerais de TypeScript
- Boas práticas universais

### ⚠️ Cuidado

**NÃO use regras globais para:**
- ❌ Regras específicas deste projeto (Fastify, Prisma, etc.)
- ❌ Regras que podem conflitar com outros projetos
- ❌ Regras que mudam frequentemente

### Como Configurar Regras Globais

**Passo a Passo:**

1. **Abrir Configurações do Cursor:**
   - Clique no ícone de **engrenagem** (⚙️) no Cursor
   - Ou use `Cmd/Ctrl + ,` para abrir configurações

2. **Navegar até Regras:**
   - No menu lateral, procure por **"Rules"** ou **"Regras"**
   - Clique em **"User Rules"** ou **"Regras do Usuário"**

3. **Adicionar Nova Regra:**
   - Clique em **"Add Rule"** ou **"Adicionar Regra"**
   - Dê um nome descritivo (ex: "TypeScript Best Practices")
   - Cole o conteúdo das regras que deseja aplicar globalmente

4. **Salvar:**
   - Clique em **"Save"** ou **"Salvar"**

### Exemplo de Regras Globais Úteis

Se você quiser criar regras globais, considere apenas padrões universais:

```markdown
# Regras Globais - TypeScript

- Sempre usar strict mode
- Proibir uso de `any` sem justificativa
- Tipar explicitamente funções públicas
- Usar interfaces para contratos públicos
```

---

## 🔄 Opção 3: Híbrida (Recomendada)

### Estratégia Ideal

**Regras Globais (Poucas):**
- Padrões universais de TypeScript
- Convenções pessoais de estilo
- Boas práticas gerais

**Regras do Projeto (`.cursorrules`):**
- Arquitetura específica do projeto
- Padrões de framework (Fastify)
- Estrutura de pastas
- Convenções do time
- Regras específicas do domínio

### Exemplo Prático

**Regras Globais (User Rules):**
```markdown
# TypeScript Universal Rules
- Sempre usar strict mode
- Proibir `any` sem justificativa
- Tipar funções públicas explicitamente
```

**Regras do Projeto (`.cursorrules`):**
```markdown
# API Solid - Regras Específicas
- Usar Fastify plugins pattern
- Services não podem conhecer Fastify
- Repositories apenas Prisma
- Estrutura modular obrigatória
```

---

## ✅ Recomendação para Este Projeto

### Para Este Projeto Específico

**Mantenha o `.cursorrules` na raiz do projeto** (como está agora):

✅ **Vantagens:**
- Regras específicas do projeto ficam versionadas
- Time inteiro usa as mesmas regras
- Evolução das regras junto com o código
- Não interfere em outros projetos

### Para Uso Pessoal Global

Se você quiser algumas regras globais para **todos** os seus projetos Node.js/TypeScript:

1. Crie regras globais apenas com padrões universais
2. Mantenha regras específicas no `.cursorrules` de cada projeto

**Exemplo de Regras Globais Úteis:**
```markdown
# TypeScript Universal Best Practices

- Sempre usar strict mode
- Proibir `any` exceto em casos raros documentados
- Tipar explicitamente funções públicas
- Preferir interfaces sobre type aliases para contratos públicos
- Usar readonly quando apropriado
```

---

## 🔍 Verificando se Está Funcionando

### Como Saber se o Cursor Está Usando as Regras

1. **Teste com uma Pergunta:**
   - Pergunte ao Cursor: "Como devo criar um novo módulo neste projeto?"
   - Ele deve responder seguindo as regras do `.cursorrules`

2. **Teste com Código:**
   - Peça para criar um service
   - Verifique se segue o padrão definido nas rules

3. **Verificar no Cursor:**
   - O Cursor mostra quando está usando regras do projeto
   - Procure por indicadores de "Project Rules" na interface

---

## 📝 Manutenção das Regras

### Quando Atualizar

- ✅ Quando padrões arquiteturais mudam
- ✅ Quando novas convenções são estabelecidas
- ✅ Quando problemas são identificados
- ✅ Quando novas tecnologias são adicionadas

### Como Atualizar

1. Edite o arquivo `.cursorrules`
2. Commit as mudanças no Git
3. O Cursor AI reconhece automaticamente as mudanças
4. Documente mudanças importantes em `docs/`

### Versionamento

- ✅ **Sempre** commitar `.cursorrules` no Git
- ✅ Usar conventional commits: `docs: atualiza regras de arquitetura`
- ✅ Documentar mudanças significativas

---

## 🎓 Dicas e Boas Práticas

### 1. Mantenha Regras Concisas

- ✅ Foque no essencial
- ✅ Evite regras muito específicas que mudam frequentemente
- ✅ Priorize padrões duradouros

### 2. Documente Decisões

- ✅ Use comentários para explicar "por quê"
- ✅ Documente exceções
- ✅ Mantenha contexto claro

### 3. Revise Regularmente

- ✅ Revise regras periodicamente
- ✅ Remova regras obsoletas
- ✅ Atualize conforme o projeto evolui

### 4. Teste as Regras

- ✅ Teste se o Cursor está seguindo as regras
- ✅ Ajuste se necessário
- ✅ Peça feedback do time

---

## 🚀 Próximos Passos

1. ✅ **Arquivo já está configurado** - `.cursorrules` na raiz
2. ✅ **Cursor AI já reconhece** - Funciona automaticamente
3. 📝 **Teste agora:** Faça uma pergunta ao Cursor sobre padrões do projeto
4. 🔄 **Mantenha atualizado:** Atualize conforme o projeto evolui

---

## ❓ FAQ

### O Cursor reconhece automaticamente?

**Sim!** O Cursor AI detecta automaticamente o arquivo `.cursorrules` na raiz do projeto.

### Preciso fazer algo especial?

**Não!** Apenas manter o arquivo na raiz. O Cursor faz o resto.

### Posso ter regras globais E do projeto?

**Sim!** Regras globais são aplicadas primeiro, depois as do projeto (que podem sobrescrever).

### Como sei se está funcionando?

Pergunte ao Cursor sobre padrões do projeto. Se ele responder seguindo as regras, está funcionando!

### Posso ter múltiplos arquivos de regras?

**Não diretamente.** Use um único `.cursorrules` na raiz, mas pode organizar com seções.

---

**Última atualização:** Janeiro 2025

