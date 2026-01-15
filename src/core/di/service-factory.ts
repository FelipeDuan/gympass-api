import type { FastifyInstance } from 'fastify';
import type { IAuthRepository } from '@/core/interfaces/auth.repository.interface';
import type { ICacheService } from '@/core/interfaces/cache.interface';
import type { IUsersRepository } from '@/core/interfaces/users.repository.interface';
import { JwtTokenService } from '@/infrastructure/auth/jwt-token-service';
import { createCacheService } from '@/infrastructure/cache/cache-service';
import { prisma } from '@/infrastructure/database/prisma';
import { FastifyLoggerAdapter } from '@/infrastructure/logger/fastify-logger-adapter';
import { createAuthRepository } from '@/modules/auth/auth.repository';
import { AuthService } from '@/modules/auth/auth.service';
import { createUsersRepository } from '@/modules/users/users.repository';
import { UsersService } from '@/modules/users/users.service';

export interface Services {
  cache: ICacheService;
  tokenService: JwtTokenService;
  usersRepository: IUsersRepository;
  authRepository: IAuthRepository;
  usersService: UsersService;
  authService: AuthService;
}

/**
 * Factory function para criar todas as instâncias de serviços
 *
 * Centraliza criação de dependências e resolve ordem de dependências.
 * Todas as instâncias são criadas uma única vez e reutilizadas.
 *
 * Usa factories de repositories para permitir injeção de dependência.
 *
 * @param app - Instância do Fastify
 * @returns Objeto com todas as instâncias de serviços
 *
 * @example
 * ```typescript
 * const services = createServices(app);
 * app.decorate('services', services);
 * ```
 */
export function createServices(app: FastifyInstance): Services {
  const logger = new FastifyLoggerAdapter(app.log);
  const cache = createCacheService(logger);
  const tokenService = new JwtTokenService(app.jwt);
  const usersRepository = createUsersRepository(prisma);
  const authRepository = createAuthRepository(prisma);
  const usersService = new UsersService(cache, usersRepository);
  const authService = new AuthService(
    tokenService,
    usersService,
    authRepository,
  );

  return {
    cache,
    tokenService,
    usersRepository,
    authRepository,
    usersService,
    authService,
  };
}
