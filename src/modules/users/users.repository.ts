import type { Prisma } from 'generated/prisma/client';
import { prisma } from '@/infra/db/prisma';
import { type UserDTO, userSelect } from './users.dto';

export const usersRepository = {
  async findByEmail(email: string): Promise<UserDTO | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  },

  async findById(id: string): Promise<UserDTO | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
      select: userSelect,
    });
  },

  async findAll(skip: number, take: number): Promise<UserDTO[]> {
    return await prisma.user.findMany({
      skip,
      take,
      select: userSelect,
      orderBy: { created_at: 'desc' },
    });
  },

  async count(): Promise<number> {
    return await prisma.user.count();
  },
};
