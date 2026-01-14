import type { JWTPayload } from '@/config/jwt';

/**
 * Interface para serviços de token
 *
 * Abstração para diferentes implementações de tokens (JWT, OAuth, etc).
 * Permite trocar implementação sem modificar código que depende dela.
 * Facilita testes ao permitir mockar o serviço de token.
 *
 * @example
 * ```typescript
 * class AuthService {
 *   constructor(private tokenService: ITokenService) {}
 *
 *   async login(user: User) {
 *     const token = this.tokenService.sign({
 *       sub: user.id,
 *       email: user.email,
 *       role: user.role,
 *     });
 *     return { token, user };
 *   }
 * }
 * ```
 */
export interface ITokenService {
  /**
   * Assina um token com o payload fornecido
   *
   * @param payload - Dados a serem incluídos no token
   * @returns Token assinado como string
   *
   * @example
   * ```typescript
   * const token = tokenService.sign({
   *   sub: 'user-id',
   *   email: 'user@example.com',
   *   role: 'USER',
   * });
   * ```
   */
  sign(payload: JWTPayload): string;

  /**
   * Verifica e decodifica um token
   *
   * @param token - Token a ser verificado
   * @returns Payload decodificado
   * @throws Error se o token for inválido ou expirado
   *
   * @example
   * ```typescript
   * try {
   *   const payload = tokenService.verify(token);
   *   console.log(payload.email); // user@example.com
   * } catch (error) {
   *   // Token inválido
   * }
   * ```
   */
  verify(token: string): JWTPayload;
}
