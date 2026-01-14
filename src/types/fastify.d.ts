import type { FastifyJWT } from '@fastify/jwt';
import type { JWTPayload } from '@/config/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJWT<{ payload: JWTPayload }>;
  }
}
