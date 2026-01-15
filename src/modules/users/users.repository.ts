import type { Prisma, PrismaClient } from 'generated/prisma/client';
import type { IUsersRepository } from '@/core/interfaces/users.repository.interface';
import { prisma } from '@/infrastructure/database/prisma';
import { type UserDTO, userSelect } from './users.dto';

/**
 * Factory function para criar uma instância do UsersRepository
 *
 * Permite injetar o PrismaClient como dependência, facilitando testes
 * e permitindo usar diferentes instâncias do Prisma (produção vs teste).
 *
 * @param prismaClient - Instância do PrismaClient a ser usada
 * @returns Instância do IUsersRepository
 *
 * @example
 * ```typescript
 * // Em produção
 * const repository = createUsersRepository(prisma);
 *
 * // Em testes
 * const repository = createUsersRepository(testPrisma);
 * ```
 */
export function createUsersRepository(
  prismaClient: PrismaClient,
): IUsersRepository {
  return {
    async findByEmail(email: string): Promise<UserDTO | null> {
      return await prismaClient.user.findUnique({
        where: { email },
        select: userSelect,
      });
    },

    async findById(id: string): Promise<UserDTO | null> {
      return await prismaClient.user.findUnique({
        where: { id },
        select: userSelect,
      });
    },

    async create(data: Prisma.UserCreateInput) {
      return await prismaClient.user.create({
        data,
        select: userSelect,
      });
    },

    async findAll(skip: number, take: number): Promise<UserDTO[]> {
      return await prismaClient.user.findMany({
        skip,
        take,
        select: userSelect,
        orderBy: { created_at: 'desc' },
      });
    },

    async count(): Promise<number> {
      return await prismaClient.user.count();
    },
  };
}

/**
 * Instância padrão do UsersRepository usando Prisma de produção
 *
 * Mantida para compatibilidade com código existente.
 * Em novos códigos, prefira usar createUsersRepository(prisma).
 */
export const usersRepository = createUsersRepository(prisma);
