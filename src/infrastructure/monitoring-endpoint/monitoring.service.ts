import { metricsCollector } from '@/infrastructure/monitoring/metrics';
import type { MetricsResponse, RouteMetrics } from './monitoring.schemas';

export const monitoringService = {
  getMetrics(): MetricsResponse {
    const allMetrics = metricsCollector.getAllMetrics();
    const formattedMetrics: Record<string, RouteMetrics> = {};

    Object.entries(allMetrics).forEach(([route, metrics]) => {
      formattedMetrics[route] = {
        count: metrics.count,
        totalDuration: metrics.totalDuration,
        averageResponseTime: metricsCollector.getAverageResponseTime(route),
        errors: metrics.errors,
        errorRate: metricsCollector.getErrorRate(route),
        lastRequestTime: metrics.lastRequestTime?.toISOString(),
      };
    });

    return {
      timestamp: new Date().toISOString(),
      routes: formattedMetrics,
    };
  },
};
