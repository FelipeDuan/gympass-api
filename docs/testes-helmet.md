# Como Testar o Helmet

## 🧪 Testes do Helmet

### 1. Teste Básico - Verificar Headers

Execute o servidor e faça uma requisição para verificar os headers:

```bash
# Iniciar servidor
pnpm dev

# Em outro terminal, testar headers
curl -I http://localhost:3100/users
```

**Headers esperados:**
```
HTTP/1.1 200 OK
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; ...
Cross-Origin-Resource-Policy: cross-origin
```

### 2. Teste com Swagger UI

Acesse a documentação e verifique se ainda funciona:

```bash
# Abrir no navegador
http://localhost:3100/docs
```

**O que verificar:**
- ✅ Swagger UI carrega corretamente
- ✅ Estilos funcionam (CSP permite 'unsafe-inline')
- ✅ Sem erros no console do navegador

### 3. Teste de Proteção XSS

Tente injetar script malicioso (deve ser bloqueado):

```bash
curl -X GET "http://localhost:3100/users?<script>alert('xss')</script>" \
  -H "Authorization: Bearer TOKEN"
```

**Esperado:** Script não executa, CSP bloqueia

### 4. Teste de Clickjacking

Tente carregar em iframe (deve ser bloqueado):

```html
<!-- Criar arquivo test-iframe.html -->
<iframe src="http://localhost:3100/users"></iframe>
```

**Esperado:** `X-Frame-Options: DENY` impede carregamento em iframe

### 5. Teste Completo com Script

```bash
# Teste completo de headers
curl -v http://localhost:3100/users 2>&1 | grep -i "x-\|content-security\|cross-origin"
```

---

## ✅ Checklist de Validação

- [ ] Headers de segurança presentes nas respostas
- [ ] Swagger UI funciona corretamente
- [ ] CSP não bloqueia recursos legítimos
- [ ] X-Frame-Options impede clickjacking
- [ ] X-Content-Type-Options previne MIME sniffing

