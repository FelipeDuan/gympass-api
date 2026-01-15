/// <reference types="vitest/globals" />

import type { FastifyReply, FastifyRequest } from 'fastify';
import { ForbiddenError } from '@/http/errors/app-error';
import { authorize } from '../../authorize';

describe('authorize middleware', () => {
  it('should allow access when user has required role', async () => {
    // Arrange
    const mockRequest = {
      user: {
        sub: 'user-id',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    } as unknown as FastifyRequest;

    const mockReply = {} as FastifyReply;
    const middleware = authorize(['ADMIN']);

    // Act & Assert - Não deve lançar erro
    await expect(middleware(mockRequest, mockReply)).resolves.not.toThrow();
  });

  it('should allow access when user has one of multiple allowed roles', async () => {
    // Arrange
    const mockRequest = {
      user: {
        sub: 'user-id',
        email: 'user@example.com',
        role: 'USER',
      },
    } as unknown as FastifyRequest;

    const mockReply = {} as FastifyReply;
    const middleware = authorize(['ADMIN', 'USER']);

    // Act & Assert - Não deve lançar erro
    await expect(middleware(mockRequest, mockReply)).resolves.not.toThrow();
  });

  it('should throw ForbiddenError when user does not have required role', async () => {
    // Arrange
    const mockRequest = {
      user: {
        sub: 'user-id',
        email: 'user@example.com',
        role: 'USER',
      },
    } as unknown as FastifyRequest;

    const mockReply = {} as FastifyReply;
    const middleware = authorize(['ADMIN']);

    // Act & Assert
    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(
      ForbiddenError,
    );
    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(
      'Insufficient permissions.',
    );
  });

  it('should throw ForbiddenError when user role is not in allowed roles list', async () => {
    // Arrange
    const mockRequest = {
      user: {
        sub: 'user-id',
        email: 'user@example.com',
        role: 'USER',
      },
    } as unknown as FastifyRequest;

    const mockReply = {} as FastifyReply;
    const middleware = authorize(['ADMIN']);

    // Act & Assert
    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(
      ForbiddenError,
    );
  });
});
