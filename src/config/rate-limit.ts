export const rateLimitConfig = {
  global: {
    max: 50,
    timeWindow: '1 minute',
  },
  auth: {
    max: 5,
    timeWindow: '1 minute',
  },
} as const;
