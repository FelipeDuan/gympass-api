import type { FastifyInstance } from 'fastify';
import type { JWTPayload } from '@/config/jwt';
import type { ITokenService } from '@/core/interfaces/token.interface';

/**
 * Implementação do serviço de token usando JWT do Fastify
 *
 * @example
 * ```typescript
 * const tokenService = new JwtTokenService(app.jwt);
 * const token = tokenService.sign({ sub: '123', email: 'user@example.com', role: 'USER' });
 * ```
 */
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwt: FastifyInstance['jwt']) {}

  sign(payload: JWTPayload): string {
    return this.jwt.sign(payload);
  }

  verify(token: string): JWTPayload {
    const decoded = this.jwt.verify<JWTPayload>(token);
    return decoded;
  }
}
