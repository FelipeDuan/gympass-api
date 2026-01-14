import type { FastifyInstance } from 'fastify';
import { redis } from '@/infra/cache/redis';
import { prisma } from '@/infra/db/prisma';
import type { HealthCheck, HealthResponse } from './health.schemas';

async function checkDatabase(app: FastifyInstance): Promise<HealthCheck> {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return {
      status: 'up',
      responseTime,
    };
  } catch (error) {
    app.log.error({ error }, 'Database health check failed');
    return {
      status: 'down',
    };
  }
}

async function checkRedis(app: FastifyInstance): Promise<HealthCheck> {
  try {
    const startTime = Date.now();
    await redis.ping();
    const responseTime = Date.now() - startTime;

    return {
      status: 'up',
      responseTime,
    };
  } catch (error) {
    app.log.error({ error }, 'Redis health check failed');
    return {
      status: 'down',
    };
  }
}

export const healthService = {
  async performHealthCheck(app: FastifyInstance): Promise<HealthResponse> {
    const [database, redisCheck] = await Promise.all([
      checkDatabase(app),
      checkRedis(app),
    ]);

    const isHealthy = database.status === 'up' && redisCheck.status === 'up';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database,
        redis: redisCheck,
      },
    };
  },
};
