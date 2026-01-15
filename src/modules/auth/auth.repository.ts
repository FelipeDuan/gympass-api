import type { PrismaClient, User } from 'generated/prisma/client';
import type { IAuthRepository } from '@/core/interfaces/auth.repository.interface';
import { prisma } from '@/infrastructure/database/prisma';

/**
 * Factory function para criar uma instância do AuthRepository
 *
 * Permite injetar o PrismaClient como dependência, facilitando testes
 * e permitindo usar diferentes instâncias do Prisma (produção vs teste).
 *
 * @param prismaClient - Instância do PrismaClient a ser usada
 * @returns Instância do IAuthRepository
 *
 * @example
 * ```typescript
 * // Em produção
 * const repository = createAuthRepository(prisma);
 *
 * // Em testes
 * const repository = createAuthRepository(testPrisma);
 * ```
 */
export function createAuthRepository(
  prismaClient: PrismaClient,
): IAuthRepository {
  return {
    async findByEmailWithPassword(email: string): Promise<User | null> {
      return await prismaClient.user.findUnique({
        where: { email },
      });
    },
  };
}

/**
 * Instância padrão do AuthRepository usando Prisma de produção
 *
 * Mantida para compatibilidade com código existente.
 * Em novos códigos, prefira usar createAuthRepository(prisma).
 */
export const authRepository = createAuthRepository(prisma);
