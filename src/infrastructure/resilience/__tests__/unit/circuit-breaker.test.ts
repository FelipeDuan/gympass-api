/// <reference types="vitest/globals" />

import { createMockLogger } from '@/__tests__/helpers/mocks';
import { CIRCUIT_BREAKER } from '@/core/shared/constants';
import { CircuitBreaker } from '../../circuit-breaker';

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLogger = createMockLogger();
    circuitBreaker = new CircuitBreaker(mockLogger);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('execute', () => {
    it('should execute function successfully when circuit is closed', async () => {
      // Arrange
      const fn = vi.fn().mockResolvedValue('success');

      // Act
      const result = await circuitBreaker.execute(fn);

      // Assert
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should return null when circuit is open', async () => {
      // Arrange
      const fn = vi.fn().mockRejectedValue(new Error('Service unavailable'));

      // Act - Trigger failures to open circuit
      for (let i = 0; i < CIRCUIT_BREAKER.THRESHOLD; i++) {
        await circuitBreaker.execute(fn);
      }

      // Circuit should be open now
      const result = await circuitBreaker.execute(fn);

      // Assert
      expect(result).toBeNull();
      expect(fn).toHaveBeenCalledTimes(CIRCUIT_BREAKER.THRESHOLD);
    });

    it('should transition to half-open after recovery timeout', async () => {
      // Arrange
      const fn = vi.fn().mockRejectedValue(new Error('Service unavailable'));

      // Act - Open circuit
      for (let i = 0; i < CIRCUIT_BREAKER.THRESHOLD; i++) {
        await circuitBreaker.execute(fn);
      }

      // Advance time past recovery timeout
      vi.advanceTimersByTime(CIRCUIT_BREAKER.RECOVERY_TIMEOUT_MS + 1000);

      // Try again - should be in half-open state
      const successFn = vi.fn().mockResolvedValue('success');
      const result = await circuitBreaker.execute(successFn);

      // Assert
      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(1);
    });

    it('should close circuit after successful execution in half-open state', async () => {
      // Arrange
      const errorFn = vi
        .fn()
        .mockRejectedValue(new Error('Service unavailable'));
      const successFn = vi.fn().mockResolvedValue('success');

      // Act - Open circuit
      for (let i = 0; i < CIRCUIT_BREAKER.THRESHOLD; i++) {
        await circuitBreaker.execute(errorFn);
      }

      // Advance time past recovery timeout
      vi.advanceTimersByTime(CIRCUIT_BREAKER.RECOVERY_TIMEOUT_MS + 1000);

      // Execute successfully in half-open state
      const result1 = await circuitBreaker.execute(successFn);
      const result2 = await circuitBreaker.execute(successFn);

      // Assert - Circuit should be closed now
      expect(result1).toBe('success');
      expect(result2).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(2);
    });

    it('should log warnings when failures occur', async () => {
      // Arrange
      const fn = vi.fn().mockRejectedValue(new Error('Service unavailable'));
      const warnSpy = vi.spyOn(mockLogger, 'warn');

      // Act
      await circuitBreaker.execute(fn);

      // Assert
      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: 'Circuit Breaker Failure',
          failures: expect.any(Number),
          error: expect.any(Error),
        }),
      );
    });

    it('should log fatal when circuit opens', async () => {
      // Arrange
      const fn = vi.fn().mockRejectedValue(new Error('Service unavailable'));
      const fatalSpy = vi.spyOn(mockLogger, 'fatal');

      // Act - Trigger failures to open circuit
      for (let i = 0; i < CIRCUIT_BREAKER.THRESHOLD; i++) {
        await circuitBreaker.execute(fn);
      }

      // Assert
      expect(fatalSpy).toHaveBeenCalledWith(
        'CIRCUIT BREAKER OPENED - Redis is bypassed',
      );
    });

    it('should reset failures on successful execution', async () => {
      // Arrange
      const errorFn = vi
        .fn()
        .mockRejectedValue(new Error('Service unavailable'));
      const successFn = vi.fn().mockResolvedValue('success');

      // Act - Fail once, then succeed
      await circuitBreaker.execute(errorFn);
      await circuitBreaker.execute(successFn);
      await circuitBreaker.execute(successFn);

      // Assert - Failures should be reset, circuit still closed
      const result = await circuitBreaker.execute(successFn);
      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(3);
    });

    it('should use custom threshold and recovery timeout', async () => {
      // Arrange
      const customThreshold = 3;
      const customRecoveryTimeout = 5000;
      const customBreaker = new CircuitBreaker(
        mockLogger,
        customThreshold,
        customRecoveryTimeout,
      );
      const errorFn = vi
        .fn()
        .mockRejectedValue(new Error('Service unavailable'));

      // Act - Open circuit with custom threshold
      for (let i = 0; i < customThreshold; i++) {
        await customBreaker.execute(errorFn);
      }

      // Circuit should be open now - function should NOT be called
      const resultWhenOpen = await customBreaker.execute(errorFn);

      // Assert - Circuit is open, so function should not be called again
      expect(resultWhenOpen).toBeNull();
      expect(errorFn).toHaveBeenCalledTimes(customThreshold);

      // Advance time past recovery timeout
      vi.advanceTimersByTime(customRecoveryTimeout + 1000);

      // Now circuit should be in half-open state - function should be called
      const successFn = vi.fn().mockResolvedValue('success');
      const resultWhenHalfOpen = await customBreaker.execute(successFn);

      // Assert - Function should be called in half-open state
      expect(resultWhenHalfOpen).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(1);
    });
  });
});
