/**
 * Constantes compartilhadas da aplicação
 *
 * Centraliza valores que são usados em múltiplos lugares,
 * facilitando manutenção e evitando magic numbers no código.
 */

export const CACHE_TTL = {
  USER_LIST: 60 * 5,
  USER_PROFILE: 60 * 10,
} as const;

export const CIRCUIT_BREAKER = {
  THRESHOLD: 5,
  RECOVERY_TIMEOUT_MS: 30000,
} as const;

export const RATE_LIMIT = {
  GLOBAL_MAX: 50,
  AUTH_MAX: 5,
  TIME_WINDOW: '1 minute',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
