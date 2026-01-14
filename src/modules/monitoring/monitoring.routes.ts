import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { metricsResponseSchema } from './monitoring.schemas';
import { monitoringService } from './monitoring.service';

export const monitoringRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/metrics',
    {
      schema: {
        tags: ['Monitoramento'],
        summary: 'Métricas da aplicação',
        response: {
          200: metricsResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const metrics = monitoringService.getMetrics();
      return reply.send(metrics);
    },
  );
};
