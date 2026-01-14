/// <reference types="vitest/globals" />

import type { IAuthRepository } from '@/core/interfaces/auth.repository.interface';
import type { ICacheService } from '@/core/interfaces/cache.interface';
import type { ILogger } from '@/core/interfaces/logger.interface';
import type { ITokenService } from '@/core/interfaces/token.interface';
import type { IUsersRepository } from '@/core/interfaces/users.repository.interface';

/**
 * Cria um mock do logger para testes
 *
 * @returns Mock do ILogger
 */
export function createMockLogger(): ILogger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    debug: vi.fn(),
  };
}

/**
 * Cria um mock do cache service para testes
 *
 * @returns Mock do ICacheService
 */
export function createMockCacheService(): ICacheService {
  const cache = new Map<string, { value: unknown; expiresAt?: number }>();

  return {
    async get<T>(key: string): Promise<T | null> {
      const item = cache.get(key);
      if (!item) return null;

      if (item.expiresAt && Date.now() > item.expiresAt) {
        cache.delete(key);
        return null;
      }

      return item.value as T;
    },

    async set(
      key: string,
      value: unknown,
      expirationInSeconds: number,
    ): Promise<void> {
      const expiresAt =
        expirationInSeconds > 0
          ? Date.now() + expirationInSeconds * 1000
          : undefined;
      cache.set(key, { value, expiresAt });
    },

    async invalidateByPattern(pattern: string): Promise<void> {
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const key of cache.keys()) {
        if (regex.test(key)) {
          cache.delete(key);
        }
      }
    },
  };
}

/**
 * Cria um mock do token service para testes
 *
 * @returns Mock do ITokenService
 */
export function createMockTokenService(): ITokenService {
  const signFn = vi.fn();
  const verifyFn = vi.fn();

  signFn.mockImplementation((payload: Parameters<ITokenService['sign']>[0]) => {
    return `mock-token-${JSON.stringify(payload)}`;
  });

  verifyFn.mockImplementation(
    (token: Parameters<ITokenService['verify']>[0]) => {
      const match = token.match(/mock-token-(.+)/);
      if (!match) throw new Error('Invalid token');
      return JSON.parse(match[1]) as ReturnType<ITokenService['verify']>;
    },
  );

  return {
    sign: signFn as ITokenService['sign'],
    verify: verifyFn as ITokenService['verify'],
  };
}

/**
 * Cria um mock do users repository para testes
 *
 * @returns Mock do IUsersRepository
 */
export function createMockUsersRepository(): IUsersRepository {
  const users = new Map<string, unknown>();

  return {
    async findByEmail(email: string) {
      for (const user of users.values()) {
        if ((user as { email: string }).email === email) {
          return user as Awaited<ReturnType<IUsersRepository['findByEmail']>>;
        }
      }
      return null;
    },

    async findById(id: string) {
      return (
        (users.get(id) as Awaited<ReturnType<IUsersRepository['findById']>>) ||
        null
      );
    },

    async create(data) {
      const user = {
        id: `mock-id-${Math.random()}`,
        ...data,
        created_at: new Date(),
      };
      users.set(user.id, user);
      return user as Awaited<ReturnType<IUsersRepository['create']>>;
    },

    async findAll(skip: number, take: number) {
      return Array.from(users.values()).slice(skip, skip + take) as Awaited<
        ReturnType<IUsersRepository['findAll']>
      >;
    },

    async count() {
      return users.size;
    },
  };
}

/**
 * Cria um mock do auth repository para testes
 *
 * @returns Mock do IAuthRepository
 */
export function createMockAuthRepository(): IAuthRepository {
  const users = new Map<string, unknown>();

  return {
    async findByEmailWithPassword(email: string) {
      for (const user of users.values()) {
        if ((user as { email: string }).email === email) {
          return user as Awaited<
            ReturnType<IAuthRepository['findByEmailWithPassword']>
          >;
        }
      }
      return null;
    },
  };
}
