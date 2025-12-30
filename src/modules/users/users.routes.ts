import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createUserSchema, listUsersSchema } from './users.schemas';
import { usersService } from './users.service';

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: createUserSchema,
    },
    async (request, reply) => {
      const user = await usersService.create(request.body);

      return reply.status(201).send({ user });
    },
  );

  app.get(
    '/',
    {
      schema: listUsersSchema,
    },
    async (request, reply) => {
      const { page, limit } = request.query;
      const result = await usersService.findAll(page, limit);

      return reply.send(result);
    },
  );
};
