import { hash } from 'argon2';
import { prisma } from '@/lib/prisma';
import type { CreateUserSchema } from './users.schemas';

export const usersService = {
  async create({ name, email, password }: CreateUserSchema) {
    const password_hash = await hash(password);

    return await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
      select: { id: true, name: true },
    });
  },

  async findyAll(page: number, limit: number) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, name: true, email: true, created_at: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { page, data, total };
  },
};
