# Dockerfile otimizado para produção
# Multi-stage build para reduzir tamanho da imagem final

# Stage 1: Build
FROM node:22-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependências (apenas produção)
RUN pnpm install --frozen-lockfile --prod=false

# Gerar Prisma Client
RUN pnpm db:generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copiar apenas arquivos necessários do builder
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/generated ./generated

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3100

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3100/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar aplicação
CMD ["node", "build/server.js"]

