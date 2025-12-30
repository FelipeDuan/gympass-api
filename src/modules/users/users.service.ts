import { hash } from 'argon2';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import type { CreateUserSchema } from './users.schemas';
import { serializeUsersPage } from './users.serializers';

export const usersService = {
  async create({ name, email, password }: CreateUserSchema) {
    const password_hash = await hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
      select: { id: true, name: true },
    });

    const stream = redis.scanStream({ match: 'users:list:*' });

    const keys: string[] = [];

    for await (const result of stream) {
      keys.push(...result);
    }

    if (keys.length) {
      await redis.del(...keys);
    }

    return user;
  },

  async findyAll(page: number, limit: number) {
    const cacheKey = `users:list:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log('⚡ veio do cache');
      return JSON.parse(cached);
    }

    console.log('🐘 veio do banco');

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, name: true, email: true, created_at: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count(),
    ]);

    const result = serializeUsersPage(data, page, total);

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  },
};
