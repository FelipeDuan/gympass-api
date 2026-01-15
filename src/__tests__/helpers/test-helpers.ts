import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { jwtConfig } from '@/config/jwt';
import {
  registerAuthRateLimit,
  registerCors,
  registerGlobalRateLimit,
  registerHelmet,
  registerRoutes,
  registerSwagger,
} from '@/config/plugins';
import { createServices } from '@/core/di/service-factory';
import { errorHandler } from '@/http/error-handler';
import { loggerConfig } from '@/infra/logger/logger';
import { cleanDatabase } from '../setup/database';

/**
 * Constrói uma instância isolada do Fastify para testes
 *
 * Cria uma nova instância do Fastify para cada teste, garantindo
 * isolamento completo entre testes que rodam em paralelo.
 * Limpa o banco antes de retornar.
 *
 * @returns Instância isolada do Fastify configurada
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

  // Cria nova instância do Fastify para isolamento
  const testApp = fastify({
    logger: false, // Desabilita logs em testes para output mais limpo
  }).withTypeProvider<ZodTypeProvider>();

  testApp.setSerializerCompiler(serializerCompiler);
  testApp.setValidatorCompiler(validatorCompiler);
  testApp.setErrorHandler(errorHandler);

  // Registra plugins
  await testApp.register(fastifyJwt, jwtConfig);

  const services = createServices(testApp);
  testApp.decorate('services', services);

  await registerHelmet(testApp);
  await registerCors(testApp);
  await registerGlobalRateLimit(testApp);
  await registerAuthRateLimit(testApp);
  await registerSwagger(testApp);
  await registerRoutes(testApp);

  return testApp;
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

/**
 * Gera um token JWT para testes
 *
 * @param app - Instância do Fastify com JWT configurado
 * @param payload - Payload do token (sub, email, role)
 * @returns Token JWT assinado
 *
 * @example
 * ```typescript
 * const token = await generateTestToken(app, {
 *   sub: 'user-id',
 *   email: 'user@example.com',
 *   role: 'USER',
 * });
 * ```
 */
export async function generateTestToken(
  app: Awaited<ReturnType<typeof buildTestApp>>,
  payload: { sub: string; email: string; role: 'ADMIN' | 'USER' },
): Promise<string> {
  return app.jwt.sign(payload);
}
