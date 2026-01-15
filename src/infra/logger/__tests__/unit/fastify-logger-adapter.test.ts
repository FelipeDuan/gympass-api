/// <reference types="vitest/globals" />

import type { FastifyBaseLogger } from 'fastify';
import { FastifyLoggerAdapter } from '../../fastify-logger-adapter';

describe('FastifyLoggerAdapter', () => {
  let mockLogger: FastifyBaseLogger;
  let adapter: FastifyLoggerAdapter;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      debug: vi.fn(),
    } as unknown as FastifyBaseLogger;

    adapter = new FastifyLoggerAdapter(mockLogger);
  });

  describe('info', () => {
    it('should call logger.info with string when data is string', () => {
      // Act
      adapter.info('test message');

      // Assert
      expect(mockLogger.info).toHaveBeenCalledWith('test message');
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call logger.info with object when data is object', () => {
      // Arrange
      const data = { message: 'test', level: 'info' };

      // Act
      adapter.info(data);

      // Assert
      expect(mockLogger.info).toHaveBeenCalledWith(data);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('should call logger.warn with string when data is string', () => {
      // Act
      adapter.warn('warning message');

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith('warning message');
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should call logger.warn with object when data is object', () => {
      // Arrange
      const data = { message: 'warning', level: 'warn' };

      // Act
      adapter.warn(data);

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith(data);
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should call logger.error with string when data is string', () => {
      // Act
      adapter.error('error message');

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('error message');
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });

    it('should call logger.error with object when data is object', () => {
      // Arrange
      const data = { message: 'error', level: 'error' };

      // Act
      adapter.error(data);

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith(data);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('fatal', () => {
    it('should call logger.fatal with message', () => {
      // Act
      adapter.fatal('fatal message');

      // Assert
      expect(mockLogger.fatal).toHaveBeenCalledWith('fatal message');
      expect(mockLogger.fatal).toHaveBeenCalledTimes(1);
    });
  });

  describe('debug', () => {
    it('should call logger.debug with string when debug exists and data is string', () => {
      // Arrange
      const loggerWithDebug = {
        ...mockLogger,
        debug: vi.fn(),
      } as unknown as FastifyBaseLogger;
      const adapterWithDebug = new FastifyLoggerAdapter(loggerWithDebug);

      // Act
      adapterWithDebug.debug('debug message');

      // Assert
      expect(loggerWithDebug.debug).toHaveBeenCalledWith('debug message');
      expect(loggerWithDebug.debug).toHaveBeenCalledTimes(1);
    });

    it('should call logger.debug with object when debug exists and data is object', () => {
      // Arrange
      const loggerWithDebug = {
        ...mockLogger,
        debug: vi.fn(),
      } as unknown as FastifyBaseLogger;
      const adapterWithDebug = new FastifyLoggerAdapter(loggerWithDebug);
      const data = { message: 'debug', level: 'debug' };

      // Act
      adapterWithDebug.debug(data);

      // Assert
      expect(loggerWithDebug.debug).toHaveBeenCalledWith(data);
      expect(loggerWithDebug.debug).toHaveBeenCalledTimes(1);
    });

    it('should not throw when debug does not exist', () => {
      // Arrange
      const loggerWithoutDebug = {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        fatal: vi.fn(),
        // debug não existe
      } as unknown as FastifyBaseLogger;
      const adapterWithoutDebug = new FastifyLoggerAdapter(loggerWithoutDebug);

      // Act & Assert - Não deve lançar erro
      expect(() => adapterWithoutDebug.debug('test')).not.toThrow();
    });
  });
});
