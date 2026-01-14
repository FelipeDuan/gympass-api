import type Redis from 'ioredis';
import type { ICacheService } from '@/core/interfaces/cache.interface';
import type { ILogger } from '@/core/interfaces/logger.interface';
import { CircuitBreaker } from '@/core/resilience/circuit-breaker';
import { CIRCUIT_BREAKER } from '@/core/shared/constants';
import { redis } from './redis';

/**
 * Implementação do serviço de cache usando Redis
 *
 * @example
 * ```typescript
 * const logger = new FastifyLoggerAdapter(app.log);
 * const cache = new RedisCacheService(redis, logger);
 * ```
 */
export class RedisCacheService implements ICacheService {
  private readonly breaker: CircuitBreaker;

  constructor(
    private readonly redisClient: Redis,
    logger: ILogger,
    threshold = CIRCUIT_BREAKER.THRESHOLD,
    recoveryTimeout = CIRCUIT_BREAKER.RECOVERY_TIMEOUT_MS,
  ) {
    this.breaker = new CircuitBreaker(logger, threshold, recoveryTimeout);
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.breaker.execute(async () => {
      const data = await this.redisClient.get(key);
      return data ? (JSON.parse(data) as T) : null;
    });
  }

  async set(
    key: string,
    value: unknown,
    expirationInSeconds: number,
  ): Promise<void> {
    await this.breaker.execute(async () => {
      await this.redisClient.set(
        key,
        JSON.stringify(value),
        'EX',
        expirationInSeconds,
      );
    });
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    await this.breaker.execute(async () => {
      const stream = this.redisClient.scanStream({ match: pattern });

      for await (const result of stream) {
        if (result.length > 0) {
          await this.redisClient.del(...result);
        }
      }
    });
  }
}

/**
 * Factory function para criar instância do cache service
 *
 * @param logger - Logger para usar no Circuit Breaker
 * @param threshold - Número de falhas antes de abrir o circuito
 * @param recoveryTimeout - Tempo em ms para tentar recuperar
 * @returns Instância do serviço de cache
 */
export function createCacheService(
  logger: ILogger,
  threshold = CIRCUIT_BREAKER.THRESHOLD,
  recoveryTimeout = CIRCUIT_BREAKER.RECOVERY_TIMEOUT_MS,
): ICacheService {
  return new RedisCacheService(redis, logger, threshold, recoveryTimeout);
}
