import { hash } from 'argon2';
import type { ICacheService } from '@/core/interfaces/cache.interface';
import type { IUsersRepository } from '@/core/interfaces/users.repository.interface';
import type { IUsersService } from '@/core/interfaces/users.service.interface';
import { CACHE_TTL } from '@/core/shared/constants';
import { ConflictError, ResourceNotFoundError } from '@/http/errors/app-error';
import type { UserDTO } from './users.dto';
import type { CreateUserSchema } from './users.schemas';
import { serializeUser, serializeUsersPage } from './users.serializers';

/**
 * Service de gerenciamento de usuários
 *
 * @example
 * ```typescript
 * const cache = createCacheService(logger);
 * const usersService = new UsersService(cache, usersRepository);
 * ```
 */
export class UsersService implements IUsersService {
  constructor(
    private readonly cache: ICacheService,
    private readonly repository: IUsersRepository,
  ) {}

  async create({ name, email, password }: CreateUserSchema): Promise<UserDTO> {
    const exists = await this.repository.findByEmail(email);

    if (exists) {
      throw new ConflictError('User with same email already exists.');
    }

    const password_hash = await hash(password);

    const user = await this.repository.create({
      name,
      email,
      password_hash,
    });

    await this.cache.invalidateByPattern('users:list:*');

    return user;
  }

  async findAll(page: number, limit: number) {
    const cacheKey = `users:list:page:${page}:limit:${limit}`;

    const cached =
      await this.cache.get<ReturnType<typeof serializeUsersPage>>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.repository.findAll(skip, limit),
      this.repository.count(),
    ]);

    const result = serializeUsersPage(data, page, total);
    await this.cache.set(cacheKey, result, CACHE_TTL.USER_LIST);

    return result;
  }

  async findById(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError('User not found.');
    }

    return serializeUser(user);
  }
}
