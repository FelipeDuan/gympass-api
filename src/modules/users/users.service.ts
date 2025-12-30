import { hash } from 'argon2';
import { cache } from '@/lib/cache';
import { ConflictError } from '@/lib/errors/app-error';
import { prisma } from '@/lib/prisma';
import { userSelect } from './users.dto';
import type { CreateUserSchema } from './users.schemas';
import { serializeUsersPage } from './users.serializers';

export const usersService = {
  async create({ name, email, password }: CreateUserSchema) {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ConflictError('User with same email already exists.');
    }

    const password_hash = await hash(password);

    const user = await prisma.user.create({
      data: { name, email, password_hash },
      select: { id: true, name: true },
    });

    await cache.invalidateByPattern('users:list:*');

    return user;
  },

  async findAll(page: number, limit: number) {
    const cacheKey = `users:list:page:${page}:limit:${limit}`;

    const cached =
      await cache.get<ReturnType<typeof serializeUsersPage>>(cacheKey);

    if (cached) return cached;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: userSelect,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count(),
    ]);

    const result = serializeUsersPage(data, page, total);

    await cache.set(cacheKey, result, 60 * 5);

    return result;
  },
};
