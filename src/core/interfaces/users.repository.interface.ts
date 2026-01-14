import type { Prisma } from 'generated/prisma/client';
import type { UserDTO } from '@/modules/users/users.dto';

/**
 * Interface para o repositório de usuários
 *
 * Define o contrato para acesso a dados de usuários.
 * Permite trocar implementação (ex: de Prisma para outro ORM) sem afetar services.
 * Facilita testes ao permitir mockar o repositório.
 *
 * @example
 * ```typescript
 * class UsersService {
 *   constructor(private repository: IUsersRepository) {}
 *
 *   async findById(id: string) {
 *     return await this.repository.findById(id);
 *   }
 * }
 * ```
 */
export interface IUsersRepository {
  /**
   * Busca um usuário por email
   *
   * @param email - Email do usuário
   * @returns Usuário encontrado ou null
   */
  findByEmail(email: string): Promise<UserDTO | null>;

  /**
   * Busca um usuário por ID
   *
   * @param id - ID do usuário
   * @returns Usuário encontrado ou null
   */
  findById(id: string): Promise<UserDTO | null>;

  /**
   * Cria um novo usuário
   *
   * @param data - Dados do usuário a ser criado
   * @returns Usuário criado
   */
  create(data: Prisma.UserCreateInput): Promise<UserDTO>;

  /**
   * Lista usuários com paginação
   *
   * @param skip - Número de registros a pular
   * @param take - Número de registros a retornar
   * @returns Lista de usuários
   */
  findAll(skip: number, take: number): Promise<UserDTO[]>;

  /**
   * Conta o total de usuários
   *
   * @returns Total de usuários
   */
  count(): Promise<number>;
}
