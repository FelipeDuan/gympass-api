import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { redis } from '@/lib/redis';
import { env } from './env';
import { errorHandler } from './lib/error-handler';
import { loggerConfig } from './lib/logger';
import { usersRoutes } from './modules/users/users.routes';

export const app = fastify({
  logger: loggerConfig,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});

app.register(fastifyRateLimit, {
  redis,
  max: 100,
  timeWindow: '1 minute',
});

if (env.NODE_ENV === 'dev') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'GymPass API',
        description: 'API para simular o GymPass, focando em princípios SOLID',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(scalarAPIReference, {
    routePrefix: '/docs',
  });
}

app.register(usersRoutes, { prefix: '/users' });
