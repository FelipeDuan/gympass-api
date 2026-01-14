import type { FastifyJWT } from '@fastify/jwt';
import type { JWTPayload } from '@/config/jwt';
import type { Services } from '@/core/di/service-factory';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJWT<{ payload: JWTPayload }>;
    services: Services;
  }
}
