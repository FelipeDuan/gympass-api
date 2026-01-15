/// <reference types="vitest/globals" />

import type { FastifyInstance } from 'fastify';
import { buildTestApp } from '@/__tests__/helpers/test-helpers';

describe('Monitoring Routes (Integration)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  describe('GET /metrics', () => {
    it('should return 200 with metrics response', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('routes');
      expect(typeof body.routes).toBe('object');
    });

    it('should return valid ISO timestamp', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(() => new Date(body.timestamp)).not.toThrow();
    });

    it('should include metrics for routes that have been accessed', async () => {
      // Arrange - Fazer algumas requisições para gerar métricas
      await app.inject({ method: 'GET', url: '/health' });
      await app.inject({ method: 'GET', url: '/metrics' });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.routes).toBeDefined();

      // Verifica se há pelo menos uma rota com métricas
      const routeKeys = Object.keys(body.routes);
      if (routeKeys.length > 0) {
        const firstRoute = body.routes[routeKeys[0]];
        expect(firstRoute).toHaveProperty('count');
        expect(firstRoute).toHaveProperty('totalDuration');
        expect(firstRoute).toHaveProperty('averageResponseTime');
        expect(firstRoute).toHaveProperty('errors');
        expect(firstRoute).toHaveProperty('errorRate');
      }
    });

    it('should return metrics with correct structure for each route', async () => {
      // Arrange - Fazer requisição para gerar métricas
      await app.inject({ method: 'GET', url: '/health' });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      // Verifica estrutura de cada rota nas métricas
      Object.values(body.routes).forEach((routeMetrics: unknown) => {
        const metrics = routeMetrics as {
          count: number;
          totalDuration: number;
          averageResponseTime: number;
          errors: number;
          errorRate: number;
          lastRequestTime?: string;
        };

        expect(typeof metrics.count).toBe('number');
        expect(metrics.count).toBeGreaterThanOrEqual(0);
        expect(typeof metrics.totalDuration).toBe('number');
        expect(metrics.totalDuration).toBeGreaterThanOrEqual(0);
        expect(typeof metrics.averageResponseTime).toBe('number');
        expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0);
        expect(typeof metrics.errors).toBe('number');
        expect(metrics.errors).toBeGreaterThanOrEqual(0);
        expect(typeof metrics.errorRate).toBe('number');
        expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
        expect(metrics.errorRate).toBeLessThanOrEqual(1);

        if (metrics.lastRequestTime) {
          expect(metrics.lastRequestTime).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          );
        }
      });
    });

    it('should match metrics response schema', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      // Valida estrutura básica do schema
      expect(typeof body.timestamp).toBe('string');
      expect(typeof body.routes).toBe('object');
    });

    it('should track metrics for multiple routes', async () => {
      // Arrange - Fazer requisições em diferentes rotas
      await app.inject({ method: 'GET', url: '/health' });
      await app.inject({ method: 'GET', url: '/metrics' });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      // Deve ter métricas para pelo menos as rotas acessadas
      const routeKeys = Object.keys(body.routes);
      expect(routeKeys.length).toBeGreaterThan(0);
    });
  });
});
