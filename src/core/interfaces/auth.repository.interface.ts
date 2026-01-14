import type { User } from 'generated/prisma/client';

/**
 * Interface para o repositório de autenticação
 *
 * Define o contrato para acesso a dados relacionados à autenticação.
 * Permite trocar implementação sem afetar services.
 * Facilita testes ao permitir mockar o repositório.
 *
 * @example
 * ```typescript
 * class AuthService {
 *   constructor(private authRepository: IAuthRepository) {}
 *
 *   async login(email: string) {
 *     const user = await this.authRepository.findByEmailWithPassword(email);
 *     // ...
 *   }
 * }
 * ```
 */
export interface IAuthRepository {
  /**
   * Busca um usuário por email incluindo a senha (hash)
   *
   * Usado apenas para autenticação, onde é necessário verificar a senha.
   * Retorna o modelo completo do Prisma (incluindo password_hash).
   *
   * @param email - Email do usuário
   * @returns Usuário encontrado com senha ou null
   */
  findByEmailWithPassword(email: string): Promise<User | null>;
}
