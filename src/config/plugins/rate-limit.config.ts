import fastifyRateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import { redis } from '@/infrastructure/cache/redis';
import { rateLimitConfig } from '../rate-limit';

export async function registerGlobalRateLimit(
  app: FastifyInstance,
): Promise<void> {
  await app.register(fastifyRateLimit, {
    redis,
    max: rateLimitConfig.global.max,
    timeWindow: rateLimitConfig.global.timeWindow,
    skipOnError: false,
  });
}

export async function registerAuthRateLimit(
  app: FastifyInstance,
): Promise<void> {
  await app.register(
    async (app) => {
      await app.register(fastifyRateLimit, {
        redis,
        max: rateLimitConfig.auth.max,
        timeWindow: rateLimitConfig.auth.timeWindow,
        skipOnError: false,
      });
    },
    { prefix: '/auth' },
  );
}
