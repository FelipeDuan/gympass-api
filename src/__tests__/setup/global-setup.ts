import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { config } from 'dotenv';

/**
 * Carrega variáveis de ambiente de teste ANTES de qualquer importação
 *
 * IMPORTANTE: Isso deve acontecer ANTES de importar qualquer módulo
 * que use process.env, para garantir que o .env.test seja carregado.
 * O dotenv/config padrão não carrega .env.test automaticamente.
 */
const envPath = resolve(process.cwd(), '.env.test');
config({ path: envPath, override: true });

/**
 * Setup global executado antes de todos os testes
 *
 * Garante que o banco de dados de teste está migrado e pronto.
 */
export async function setup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      `Tests should run with NODE_ENV=test. Current NODE_ENV: ${process.env.NODE_ENV}`,
    );
  }

  console.log('🧪 Setting up test database...');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is required for tests. Check .env.test file.',
    );
  }

  try {
    execSync('pnpm db:push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    console.log('✅ Test database ready');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
}
