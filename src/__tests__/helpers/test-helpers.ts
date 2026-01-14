import type { FastifyInstance } from 'fastify';
import { app, setupPlugins } from '@/config/app';
import { cleanDatabase } from '../setup/database';

/**
 * Constrói uma instância do Fastify para testes
 *
 * Configura todos os plugins e retorna app pronto para uso.
 * Limpa o banco antes de retornar.
 *
 * @returns Instância do Fastify configurada
 *
 * @example
 * ```typescript
 * const app = await buildTestApp();
 * const response = await app.inject({
 *   method: 'GET',
 *   url: '/users',
 * });
 * ```
 */
export async function buildTestApp(): Promise<FastifyInstance> {
  await cleanDatabase();
  await setupPlugins();
  return app;
}

/**
 * Gera um email aleatório para testes
 *
 * @returns Email único no formato test-{random}@example.com
 */
export function generateRandomEmail(): string {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
}

/**
 * Gera uma string aleatória
 *
 * @param length - Comprimento da string (padrão: 10)
 * @returns String aleatória
 */
export function generateRandomString(length = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * Gera um UUID aleatório
 *
 * @returns UUID v4
 */
export function generateRandomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
