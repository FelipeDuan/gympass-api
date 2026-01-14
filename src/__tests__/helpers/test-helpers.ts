import type { FastifyInstance } from 'fastify';
import { app } from '@/config/app';

export async function buildTestApp(): Promise<FastifyInstance> {
  return app;
}

export function generateRandomEmail(): string {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomString(length = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}
