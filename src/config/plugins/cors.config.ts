import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { env } from '../env';

function getAllowedOrigins(): string[] {
  if (env.NODE_ENV === 'production') {
    return env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
  }

  return [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ];
}

export async function registerCors(app: FastifyInstance): Promise<void> {
  const allowedOrigins = getAllowedOrigins();

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) {
        cb(null, true);
        return;
      }

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
