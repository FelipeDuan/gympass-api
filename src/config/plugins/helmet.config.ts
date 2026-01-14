import fastifyHelmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';
import { env } from '../env';

export async function registerHelmet(app: FastifyInstance): Promise<void> {
  const isDev = env.NODE_ENV === 'dev';

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: [
          "'self'",
          ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:', 'https:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: isDev ? ["'self'"] : ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
}
