import { CircuitBreaker } from '@/core/resilience/circuit-breaker';
import { redis } from './redis';

const breaker = new CircuitBreaker(5, 30000);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    return await breaker.execute(async () => {
      const data = await redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    });
  },

  async set(
    key: string,
    value: unknown,
    expirationInSeconds = 60,
  ): Promise<void> {
    await breaker.execute(async () => {
      await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
    });
  },

  async invalidateByPattern(pattern: string): Promise<void> {
    await breaker.execute(async () => {
      const stream = redis.scanStream({ match: pattern });

      for await (const result of stream) {
        if (result.length > 0) {
          await redis.del(...result);
        }
      }
    });
  },
};
