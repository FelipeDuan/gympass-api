/// <reference types="vitest/globals" />

import { resolve } from 'node:path';
import { config } from 'dotenv';

/**
 * Carrega variáveis de ambiente de teste ANTES de qualquer importação
 *
 * Isso garante que o .env.test seja carregado antes do código de produção
 * tentar acessar process.env. Mantém separação de responsabilidades:
 * - Código de produção usa .env (via dotenv/config)
 * - Código de teste usa .env.test (carregado aqui)
 */
config({ path: resolve(process.cwd(), '.env.test') });

import { cleanDatabase, closeDatabase } from './database';

/**
 * Setup executado antes de cada arquivo de teste
 *
 * Com globals: true no vitest.config.ts, beforeAll, afterEach e afterAll
 * estão disponíveis globalmente e não precisam ser importados.
 */
beforeAll(async () => {
  await cleanDatabase();
});

/**
 * Limpeza executada após cada teste
 */
afterEach(async () => {
  await cleanDatabase();
});

/**
 * Teardown executado após todos os testes do arquivo
 */
afterAll(async () => {
  await closeDatabase();
});
