import type { ILogger } from '@/core/interfaces/logger.interface';
import { CIRCUIT_BREAKER } from '@/core/shared/constants';

enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

/**
 * Circuit Breaker Pattern Implementation
 *
 * Protege contra falhas em cascata quando serviços externos falham.
 * Abre o circuito após um número de falhas, permitindo recuperação após timeout.
 *
 * @example
 * ```typescript
 * const logger = new FastifyLoggerAdapter(app.log);
 * const breaker = new CircuitBreaker(logger);
 *
 * const result = await breaker.execute(async () => {
 *   return await externalService.call();
 * });
 * ```
 */
export class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private lastFailureTime?: number;

  constructor(
    private readonly logger: ILogger,
    private threshold = CIRCUIT_BREAKER.THRESHOLD,
    private recoveryTimeout = CIRCUIT_BREAKER.RECOVERY_TIMEOUT_MS,
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T | null> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - (this.lastFailureTime || 0) > this.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        return null;
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      return null;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(error: unknown) {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.logger.warn({
      msg: 'Circuit Breaker Failure',
      failures: this.failures,
      error,
    });

    if (this.failures >= this.threshold) {
      this.state = CircuitState.OPEN;
      this.logger.fatal('CIRCUIT BREAKER OPENED - Redis is bypassed');
    }
  }
}
