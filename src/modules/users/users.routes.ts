import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  authenticate,
  authorize,
  getAuthenticatedUser,
} from '@/http/middlewares';
import { getProfileSchema, listUsersSchema } from './users.schemas';
import { usersService } from './users.service';

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/',
    {
      schema: listUsersSchema,
      preHandler: [authenticate, authorize(['ADMIN', 'USER'])],
    },
    async (request, reply) => {
      const { page, limit } = request.query;
      const result = await usersService.findAll(page, limit);

      return reply.send(result);
    },
  );

  app.get(
    '/me',
    {
      schema: getProfileSchema,
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const user = getAuthenticatedUser(request);
      const profile = await usersService.findById(user.sub);

      return reply.send(profile);
    },
  );
};
