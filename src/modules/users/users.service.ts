import { hash } from 'argon2';
import { ConflictError } from '@/http/errors/app-error';
import { cache } from '@/infra/cache/cache-service';
import { usersRepository } from './users.repository';
import type { CreateUserSchema } from './users.schemas';
import { serializeUsersPage } from './users.serializers';

export const usersService = {
  async create({ name, email, password }: CreateUserSchema) {
    const exists = await usersRepository.findByEmail(email);

    if (exists) {
      throw new ConflictError('User with same email already exists.');
    }

    const password_hash = await hash(password);

    const user = await usersRepository.create({
      name,
      email,
      password_hash,
    });

    await cache.invalidateByPattern('users:list:*');

    return user;
  },

  async findAll(page: number, limit: number) {
    const cacheKey = `users:list:page:${page}:limit:${limit}`;

    const cached =
      await cache.get<ReturnType<typeof serializeUsersPage>>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      usersRepository.findAll(skip, limit),
      usersRepository.count(),
    ]);

    const result = serializeUsersPage(data, page, total);
    await cache.set(cacheKey, result, 60 * 5);

    return result;
  },
};
