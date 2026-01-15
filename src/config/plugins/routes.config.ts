import type { FastifyInstance } from 'fastify';
import { healthRoutes } from '@/infrastructure/health/health.routes';
import { metricsCollector } from '@/infrastructure/monitoring/metrics';
import { monitoringRoutes } from '@/infrastructure/monitoring-endpoint/monitoring.routes';
import { authRoutes } from '@/modules/auth/auth.routes';
import { usersRoutes } from '@/modules/users/users.routes';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(healthRoutes);

  // Monitoring (apenas em dev/staging)
  if (process.env.NODE_ENV !== 'production') {
    await app.register(monitoringRoutes);
  }

  // coletar métricas
  app.addHook('onRequest', async (request) => {
    // armazenar tempo de início da requisição
    (request as unknown as { startTime: number }).startTime = Date.now();
  });

  app.addHook('onResponse', async (request, reply) => {
    const startTime =
      (request as unknown as { startTime?: number }).startTime || Date.now();
    const route = request.url.split('?')[0]; // remover query params
    const duration = Date.now() - startTime;
    const isError = reply.statusCode >= 400;
    metricsCollector.recordRequest(route, duration, isError);
  });

  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(usersRoutes, { prefix: '/users' });
}
