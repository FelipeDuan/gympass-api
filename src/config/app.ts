import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { errorHandler } from '../http/error-handler';
import { loggerConfig } from '../infra/logger/logger';
import { jwtConfig } from './jwt';
import {
  registerAuthRateLimit,
  registerCors,
  registerGlobalRateLimit,
  registerHelmet,
  registerRoutes,
  registerSwagger,
} from './plugins';

export const app = fastify({
  logger: loggerConfig,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

export async function setupPlugins(): Promise<void> {
  // segurança (ordem importante)
  await registerHelmet(app);
  await registerCors(app);
  await registerGlobalRateLimit(app);
  await registerAuthRateLimit(app);

  await registerSwagger(app);

  await app.register(fastifyJwt, jwtConfig);

  await registerRoutes(app);
}
