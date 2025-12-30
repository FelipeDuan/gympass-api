import { app } from '@/config/app';

enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

export class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private lastFailureTime?: number;

  constructor(
    private threshold = 5,
    private recoveryTimeout = 30000,
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
    app.log.warn({
      msg: 'Circuit Breaker Failure',
      failures: this.failures,
      error,
    });

    if (this.failures >= this.threshold) {
      this.state = CircuitState.OPEN;
      app.log.fatal('CIRCUIT BREAKER OPENED - Redis is bypassed');
    }
  }
}
