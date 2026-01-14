import type { FastifyBaseLogger } from 'fastify';
import type { ILogger } from '@/core/interfaces/logger.interface';

/**
 * Adapter do logger do Fastify para ILogger
 *
 * Permite usar o logger do Fastify através da interface ILogger,
 * desacoplando componentes do logger específico do Fastify.
 *
 * @example
 * ```typescript
 * const logger = new FastifyLoggerAdapter(app.log);
 * const breaker = new CircuitBreaker(logger);
 * ```
 */
export class FastifyLoggerAdapter implements ILogger {
  constructor(private readonly logger: FastifyBaseLogger) {}

  info(data: unknown): void {
    if (typeof data === 'string') {
      this.logger.info(data);
    } else {
      this.logger.info(data as Record<string, unknown>);
    }
  }

  warn(data: unknown): void {
    if (typeof data === 'string') {
      this.logger.warn(data);
    } else {
      this.logger.warn(data as Record<string, unknown>);
    }
  }

  error(data: unknown): void {
    if (typeof data === 'string') {
      this.logger.error(data);
    } else {
      this.logger.error(data as Record<string, unknown>);
    }
  }

  fatal(message: string): void {
    this.logger.fatal(message);
  }

  debug(data: unknown): void {
    if (this.logger.debug) {
      if (typeof data === 'string') {
        this.logger.debug(data);
      } else {
        this.logger.debug(data as Record<string, unknown>);
      }
    }
  }
}
