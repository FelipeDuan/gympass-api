/// <reference types="vitest/globals" />

import type { FastifyInstance } from 'fastify';
import type { JWTPayload } from '@/config/jwt';
import { JwtTokenService } from '../../jwt-token-service';

describe('JwtTokenService', () => {
  let mockJwt: FastifyInstance['jwt'];
  let tokenService: JwtTokenService;

  beforeEach(() => {
    mockJwt = {
      sign: vi.fn(),
      verify: vi.fn(),
    } as unknown as FastifyInstance['jwt'];

    tokenService = new JwtTokenService(mockJwt);
  });

  describe('sign', () => {
    it('should call jwt.sign with payload and return token', () => {
      // Arrange
      const payload: JWTPayload = {
        sub: 'user-id',
        email: 'user@example.com',
        role: 'USER',
      };
      const expectedToken = 'mock-jwt-token';
      vi.mocked(mockJwt.sign).mockReturnValue(expectedToken);

      // Act
      const result = tokenService.sign(payload);

      // Assert
      expect(mockJwt.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe(expectedToken);
    });

    it('should sign token for ADMIN role', () => {
      // Arrange
      const payload: JWTPayload = {
        sub: 'admin-id',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      const expectedToken = 'admin-token';
      vi.mocked(mockJwt.sign).mockReturnValue(expectedToken);

      // Act
      const result = tokenService.sign(payload);

      // Assert
      expect(result).toBe(expectedToken);
      expect(mockJwt.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('verify', () => {
    it('should call jwt.verify with token and return payload', () => {
      // Arrange
      const token = 'valid-token';
      const expectedPayload: JWTPayload = {
        sub: 'user-id',
        email: 'user@example.com',
        role: 'USER',
      };
      vi.mocked(mockJwt.verify).mockReturnValue(expectedPayload);

      // Act
      const result = tokenService.verify(token);

      // Assert
      expect(mockJwt.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedPayload);
    });

    it('should throw error when token is invalid', () => {
      // Arrange
      const token = 'invalid-token';
      vi.mocked(mockJwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      expect(() => tokenService.verify(token)).toThrow('Invalid token');
    });
  });
});
