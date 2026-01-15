import { z } from 'zod';

export const routeMetricsSchema = z.object({
  count: z.number(),
  totalDuration: z.number(),
  averageResponseTime: z.number(),
  errors: z.number(),
  errorRate: z.number(),
  lastRequestTime: z.string().optional(),
});

export const metricsResponseSchema = z.object({
  timestamp: z.string(),
  routes: z.record(z.string(), routeMetricsSchema),
});

export type RouteMetrics = z.infer<typeof routeMetricsSchema>;
export type MetricsResponse = z.infer<typeof metricsResponseSchema>;
