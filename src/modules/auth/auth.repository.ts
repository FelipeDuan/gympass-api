import type { User } from 'generated/prisma/client';
import type { IAuthRepository } from '@/core/interfaces/auth.repository.interface';
import { prisma } from '@/infra/db/prisma';

export const authRepository: IAuthRepository = {
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
};
