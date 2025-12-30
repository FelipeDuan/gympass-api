// src/lib/error-handler.ts
import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { env } from '@/env';
import { AppError } from '@/lib/errors/app-error';

export const errorHandler: FastifyInstance['errorHandler'] = (
  error,
  request,
  reply,
) => {
  const timestamp = new Date().toISOString();
  const statusCode = error.statusCode || 500;

  // 1. Erros de Validação (Zod)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      timestamp,
      statusCode: 400,
      code: 'ERR_VALIDATION',
      message: 'Validation failed.',
      fields: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      timestamp,
      statusCode: 400,
      code: 'ERR_VALIDATION',
      message: 'Validation failed.',
      fields: error.validation.map((v: any) => ({
        // Mapeia o caminho do erro que o Fastify/AJV/Zod entregam
        field:
          v.instancePath?.replace('/', '') ||
          v.params?.missingProperty ||
          'field',
        message: v.message,
      })),
    });
  }

  // 2. Erros Customizados da Aplicação (Exceptions)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      timestamp,
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    });
  }

  request.log.error(error);

  return reply.status(statusCode).send({
    timestamp,
    statusCode,
    code: 'ERR_INTERNAL_SERVER_ERROR',
    message:
      env.NODE_ENV === 'dev' ? error.message : 'An unexpected error occurred.',
  });
};
