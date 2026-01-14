#!/bin/bash
# Script para testar headers do Helmet

echo "🧪 Testando Headers de Segurança do Helmet"
echo "=========================================="
echo ""

echo "1. Testando headers básicos..."
curl -I http://localhost:3100/users 2>&1 | grep -i "x-\|content-security\|cross-origin" || echo "Servidor não está rodando ou rota requer autenticação"

echo ""
echo "2. Testando com autenticação (precisa de token válido)..."
echo "   Execute: curl -I http://localhost:3100/users -H 'Authorization: Bearer SEU_TOKEN'"

echo ""
echo "3. Testando Swagger UI..."
echo "   Acesse: http://localhost:3100/docs no navegador"
echo "   Verifique se carrega sem erros no console"

echo ""
echo "✅ Headers esperados:"
echo "   - X-Content-Type-Options: nosniff"
echo "   - X-Frame-Options: DENY"
echo "   - X-XSS-Protection: 1; mode=block"
echo "   - Content-Security-Policy: ..."
echo "   - Cross-Origin-Resource-Policy: cross-origin"

