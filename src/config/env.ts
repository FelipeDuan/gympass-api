import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  PORT: z.coerce.number().default(3100),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
