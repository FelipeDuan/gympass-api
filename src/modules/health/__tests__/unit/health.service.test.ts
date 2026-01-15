/// <reference types="vitest/globals" />

import type { FastifyInstance } from 'fastify';
import { createMockLogger } from '@/__tests__/helpers/mocks';

// Mock dos módulos antes de importar o service
vi.mock('@/infra/db/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock('@/infra/cache/redis', () => ({
  redis: {
    ping: vi.fn(),
  },
}));

import { redis } from '@/infra/cache/redis';
import { prisma } from '@/infra/db/prisma';
// Importa após os mocks
import { healthService } from '../../health.service';

describe('HealthService', () => {
  let mockApp: FastifyInstance;

  beforeEach(() => {
    // Mock do FastifyInstance com logger
    mockApp = {
      log: createMockLogger(),
    } as unknown as FastifyInstance;

    // Limpa mocks antes de cada teste
    vi.clearAllMocks();
  });

  describe('performHealthCheck', () => {
    it('should return healthy status when database and redis are up', async () => {
      // Arrange - Mock prisma e redis para retornar sucesso
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.status).toBe('healthy');
      expect(result.checks.database.status).toBe('up');
      expect(result.checks.redis.status).toBe('up');
      expect(result.checks.database.responseTime).toBeDefined();
      expect(result.checks.redis.responseTime).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
    });

    it('should return unhealthy status when database is down', async () => {
      // Arrange - Mock prisma para falhar e redis para funcionar
      vi.mocked(prisma.$queryRaw).mockRejectedValue(
        new Error('Database connection failed'),
      );
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.status).toBe('unhealthy');
      expect(result.checks.database.status).toBe('down');
      expect(result.checks.redis.status).toBe('up');
      expect(result.checks.database.responseTime).toBeUndefined();
      expect(mockApp.log.error).toHaveBeenCalled();
    });

    it('should return unhealthy status when redis is down', async () => {
      // Arrange - Mock prisma para funcionar e redis para falhar
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
      vi.mocked(redis.ping).mockRejectedValue(
        new Error('Redis connection failed'),
      );

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.status).toBe('unhealthy');
      expect(result.checks.database.status).toBe('up');
      expect(result.checks.redis.status).toBe('down');
      expect(result.checks.redis.responseTime).toBeUndefined();
      expect(mockApp.log.error).toHaveBeenCalled();
    });

    it('should return unhealthy status when both database and redis are down', async () => {
      // Arrange - Mock ambos para falhar
      vi.mocked(prisma.$queryRaw).mockRejectedValue(
        new Error('Database connection failed'),
      );
      vi.mocked(redis.ping).mockRejectedValue(
        new Error('Redis connection failed'),
      );

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.status).toBe('unhealthy');
      expect(result.checks.database.status).toBe('down');
      expect(result.checks.redis.status).toBe('down');
      expect(mockApp.log.error).toHaveBeenCalledTimes(2);
    });

    it('should include responseTime in checks when services are up', async () => {
      // Arrange
      vi.mocked(prisma.$queryRaw).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return [{ '?column?': 1 }] as any;
      });

      vi.mocked(redis.ping).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return 'PONG';
      });

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.checks.database.responseTime).toBeGreaterThanOrEqual(10);
      expect(result.checks.redis.responseTime).toBeGreaterThanOrEqual(5);
    });

    it('should return valid ISO timestamp', async () => {
      // Arrange
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return valid uptime number', async () => {
      // Arrange
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as any);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      // Act
      const result = await healthService.performHealthCheck(mockApp);

      // Assert
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
