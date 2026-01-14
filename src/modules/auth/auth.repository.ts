import type { User } from 'generated/prisma/client';
import { prisma } from '@/infra/db/prisma';

export const authRepository = {
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
};
