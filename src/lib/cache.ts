// src/lib/cache.ts
import { redis } from './redis';

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(
    key: string,
    value: unknown,
    expirationInSeconds = 60,
  ): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
  },

  async invalidateByPattern(pattern: string): Promise<void> {
    const stream = redis.scanStream({ match: pattern });
    for await (const result of stream) {
      if (result.length) {
        await redis.del(...result);
      }
    }
  },
};
