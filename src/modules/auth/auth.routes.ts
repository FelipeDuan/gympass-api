import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { loginSchema, registerSchema } from './auth.schemas';
import { authService } from './auth.service';

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register',
    {
      schema: registerSchema,
    },
    async (request, reply) => {
      const result = await authService.register(app, request.body);
      return reply.status(201).send(result);
    },
  );

  app.post(
    '/login',
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      const result = await authService.login(app, request.body);
      return reply.send(result);
    },
  );
};
