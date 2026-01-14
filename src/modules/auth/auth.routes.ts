import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { loginSchema, registerSchema } from './auth.schemas';

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  const { authService } = app.services;

  app.post(
    '/register',
    {
      schema: registerSchema,
    },
    async (request, reply) => {
      const result = await authService.register(request.body);
      return reply.status(201).send(result);
    },
  );

  app.post(
    '/login',
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      const result = await authService.login(request.body);
      return reply.send(result);
    },
  );
};
