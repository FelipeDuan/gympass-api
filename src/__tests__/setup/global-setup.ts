import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { config } from 'dotenv';

/**
 * Carrega variáveis de ambiente de teste antes de tudo
 *
 * IMPORTANTE: Isso deve acontecer ANTES de importar qualquer módulo
 * que use process.env, para garantir que o .env.test seja carregado.
 */
config({ path: resolve(process.cwd(), '.env.test') });

import { env } from '@/config/env';

/**
 * Setup global executado antes de todos os testes
 *
 * Garante que o banco de dados de teste está migrado e pronto.
 */
export async function setup() {
  if (env.NODE_ENV !== 'test') {
    throw new Error(
      `Tests should run with NODE_ENV=test. Current NODE_ENV: ${env.NODE_ENV}`,
    );
  }

  console.log('🧪 Setting up test database...');

  try {
    execSync('pnpm db:push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: env.DATABASE_URL,
      },
    });

    console.log('✅ Test database ready');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
}
