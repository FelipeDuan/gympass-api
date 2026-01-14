import { RATE_LIMIT } from '@/core/shared/constants';

export const rateLimitConfig = {
  global: {
    max: RATE_LIMIT.GLOBAL_MAX,
    timeWindow: RATE_LIMIT.TIME_WINDOW,
  },
  auth: {
    max: RATE_LIMIT.AUTH_MAX,
    timeWindow: RATE_LIMIT.TIME_WINDOW,
  },
} as const;
