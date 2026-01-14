import { z } from 'zod';

export const healthCheckSchema = z.object({
  status: z.enum(['up', 'down']),
  responseTime: z.number().optional(),
});

export const healthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  checks: z.object({
    database: healthCheckSchema,
    redis: healthCheckSchema,
  }),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
