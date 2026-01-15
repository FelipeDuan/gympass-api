import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { healthResponseSchema } from './health.schemas';
import { healthService } from './health.service';

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health check'],
        summary: 'Health check endpoint',
        response: {
          200: healthResponseSchema,
          503: healthResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const health = await healthService.performHealthCheck(app);
      const statusCode = health.status === 'healthy' ? 200 : 503;

      return reply.status(statusCode).send(health);
    },
  );
};
