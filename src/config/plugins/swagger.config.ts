import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { env } from '../env';

export async function registerSwagger(app: FastifyInstance): Promise<void> {
  if (env.NODE_ENV !== 'dev') {
    return;
  }

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'GymPass API',
        description: 'API para simular o GymPass, focando em princípios SOLID',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(scalarAPIReference, {
    routePrefix: '/docs',
  });
}
