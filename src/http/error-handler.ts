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

/**
 * Type guard para verificar se erro tem propriedade validation
 */
function isValidationError(
  error: unknown,
): error is { validation: FastifyValidationError[] } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'validation' in error &&
    Array.isArray((error as { validation: unknown }).validation)
  );
}

/**
 * Type guard para verificar se erro tem propriedade message
 */
function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

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

  if (isValidationError(error)) {
    const fields = error.validation.map((v) => ({
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

  // Log error de forma segura
  if (error instanceof Error) {
    request.log.error({ err: error }, error.message);
  } else {
    request.log.error({ error }, 'Unexpected error occurred');
  }

  return reply.status(500).send({
    timestamp,
    statusCode: 500,
    code: 'ERR_INTERNAL_SERVER_ERROR',
    message:
      env.NODE_ENV === 'dev' && hasMessage(error)
        ? error.message
        : 'An unexpected error occurred.',
  });
};
