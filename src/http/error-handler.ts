import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { env } from '@/config/env';
import { AppError } from '@/http/errors/app-error';

type FastifyValidationError = {
  instancePath?: string;
  message?: string;
  params?: {
    missingProperty?: string;
  };
};

export const errorHandler: FastifyInstance['errorHandler'] = (
  error,
  request,
  reply,
) => {
  const timestamp = new Date().toISOString();

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
    const fields = (error.validation as FastifyValidationError[]).map((v) => ({
      field:
        v.instancePath?.replace('/', '') ||
        v.params?.missingProperty ||
        'field',
      message: v.message ?? 'Invalid value',
    }));

    return reply.status(400).send({
      timestamp,
      statusCode: 400,
      code: 'ERR_VALIDATION',
      message: 'Validation failed.',
      fields,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      timestamp,
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    timestamp,
    statusCode: 500,
    code: 'ERR_INTERNAL_SERVER_ERROR',
    message:
      env.NODE_ENV === 'dev' ? error.message : 'An unexpected error occurred.',
  });
};
