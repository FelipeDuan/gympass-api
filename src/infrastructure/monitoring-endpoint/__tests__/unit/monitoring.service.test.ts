/// <reference types="vitest/globals" />

import { metricsCollector } from '@/infrastructure/monitoring/metrics';
import { monitoringService } from '../../monitoring.service';

describe('MonitoringService', () => {
  beforeEach(() => {
    // Limpa métricas antes de cada teste
    metricsCollector.reset();
  });

  describe('getMetrics', () => {
    it('should return metrics with timestamp and routes', () => {
      // Act
      const result = monitoringService.getMetrics();

      // Assert
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('routes');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.routes).toBe('object');
    });

    it('should return valid ISO timestamp', () => {
      // Act
      const result = monitoringService.getMetrics();

      // Assert
      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return empty routes object when no metrics recorded', () => {
      // Act
      const result = monitoringService.getMetrics();

      // Assert
      expect(result.routes).toEqual({});
      expect(Object.keys(result.routes)).toHaveLength(0);
    });

    it('should return formatted metrics for recorded routes', () => {
      // Arrange - Registrar algumas métricas
      metricsCollector.recordRequest('/test-route', 100, false);
      metricsCollector.recordRequest('/test-route', 200, false);
      metricsCollector.recordRequest('/another-route', 50, true);

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      expect(Object.keys(result.routes).length).toBeGreaterThan(0);
      expect(result.routes['/test-route']).toBeDefined();
      expect(result.routes['/another-route']).toBeDefined();
    });

    it('should format route metrics correctly', () => {
      // Arrange
      const route = '/test-route';
      metricsCollector.recordRequest(route, 100, false);
      metricsCollector.recordRequest(route, 200, false);
      metricsCollector.recordRequest(route, 50, true); // Error

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      const routeMetrics = result.routes[route];
      expect(routeMetrics).toBeDefined();
      expect(routeMetrics.count).toBe(3);
      expect(routeMetrics.totalDuration).toBe(350);
      expect(routeMetrics.averageResponseTime).toBeCloseTo(116.67, 1);
      expect(routeMetrics.errors).toBe(1);
      expect(routeMetrics.errorRate).toBeCloseTo(33.33, 1);
      expect(routeMetrics.lastRequestTime).toBeDefined();
    });

    it('should calculate average response time correctly', () => {
      // Arrange
      const route = '/avg-test';
      metricsCollector.recordRequest(route, 100, false);
      metricsCollector.recordRequest(route, 200, false);
      metricsCollector.recordRequest(route, 300, false);

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      const routeMetrics = result.routes[route];
      expect(routeMetrics.averageResponseTime).toBe(200); // (100 + 200 + 300) / 3
    });

    it('should calculate error rate correctly', () => {
      // Arrange
      const route = '/error-test';
      metricsCollector.recordRequest(route, 100, false);
      metricsCollector.recordRequest(route, 200, true); // Error
      metricsCollector.recordRequest(route, 300, true); // Error

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      const routeMetrics = result.routes[route];
      expect(routeMetrics.errors).toBe(2);
      expect(routeMetrics.errorRate).toBeCloseTo(66.67, 1); // 2/3 * 100
    });

    it('should include lastRequestTime when available', () => {
      // Arrange
      const route = '/time-test';
      metricsCollector.recordRequest(route, 100, false);

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      const routeMetrics = result.routes[route];
      expect(routeMetrics.lastRequestTime).toBeDefined();
      expect(typeof routeMetrics.lastRequestTime).toBe('string');
      expect(routeMetrics.lastRequestTime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should handle multiple routes independently', () => {
      // Arrange
      metricsCollector.recordRequest('/route1', 100, false);
      metricsCollector.recordRequest('/route2', 200, false);
      metricsCollector.recordRequest('/route1', 150, false);

      // Act
      const result = monitoringService.getMetrics();

      // Assert
      expect(result.routes['/route1'].count).toBe(2);
      expect(result.routes['/route1'].totalDuration).toBe(250);
      expect(result.routes['/route2'].count).toBe(1);
      expect(result.routes['/route2'].totalDuration).toBe(200);
    });
  });
});
