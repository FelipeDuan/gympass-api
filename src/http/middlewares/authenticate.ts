import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JWTPayload } from '@/config/jwt';
import { UnauthorizedError } from '../errors/app-error';

export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError('Invalid or missing token.');
  }
}

export function getAuthenticatedUser(request: FastifyRequest): JWTPayload {
  return request.user as JWTPayload;
}
