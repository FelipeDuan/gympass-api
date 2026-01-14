import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Role } from 'generated/prisma/client';
import { ForbiddenError } from '../errors/app-error';
import { getAuthenticatedUser } from './authenticate';

/**
 * Middleware de autorização
 * Verifica se o usuário autenticado tem uma das roles permitidas
 *
 * @param allowedRoles - Array de roles permitidas (ex: ['ADMIN'] ou ['ADMIN', 'USER'])
 * @returns Função middleware que verifica a role do usuário
 *
 * @example
 * // Apenas ADMIN pode acessar
 * app.get('/admin', { preHandler: [authenticate, authorize(['ADMIN'])] }, handler)
 *
 * @example
 * // ADMIN ou USER podem acessar
 * app.get('/users', { preHandler: [authenticate, authorize(['ADMIN', 'USER'])] }, handler)
 */
export function authorize(allowedRoles: Role[]) {
  return async (
    request: FastifyRequest,
    _reply: FastifyReply,
  ): Promise<void> => {
    const user = getAuthenticatedUser(request);

    if (!allowedRoles.includes(user.role as Role)) {
      throw new ForbiddenError('Insufficient permissions.');
    }
  };
}
