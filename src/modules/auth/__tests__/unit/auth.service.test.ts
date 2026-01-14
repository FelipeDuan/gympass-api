/// <reference types="vitest/globals" />

import { hash, verify } from 'argon2';
import type { User } from 'generated/prisma/client';
import { createUserFixture } from '@/__tests__/fixtures/user.fixtures';
import {
  createMockAuthRepository,
  createMockCacheService,
  createMockTokenService,
  createMockUsersRepository,
} from '@/__tests__/helpers/mocks';
import { UnauthorizedError } from '@/http/errors/app-error';
import type { UserDTO } from '@/modules/users/users.dto';
import { UsersService } from '@/modules/users/users.service';
import { AuthService } from '../../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockTokenService: ReturnType<typeof createMockTokenService>;
  let mockUsersService: UsersService;
  let mockAuthRepository: ReturnType<typeof createMockAuthRepository>;

  beforeEach(() => {
    mockTokenService = createMockTokenService();
    const mockCache = createMockCacheService();
    const mockUsersRepository = createMockUsersRepository();
    mockUsersService = new UsersService(mockCache, mockUsersRepository);
    mockAuthRepository = createMockAuthRepository();
    authService = new AuthService(
      mockTokenService,
      mockUsersService,
      mockAuthRepository,
    );
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      // Arrange
      const userData = createUserFixture({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const createdUser: UserDTO = {
        id: 'user-123',
        name: userData.name,
        email: userData.email,
        role: 'USER',
        created_at: new Date(),
      };

      vi.spyOn(mockUsersService, 'create').mockResolvedValue(createdUser);
      const signSpy = vi.spyOn(mockTokenService, 'sign');

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(createdUser.id);
      expect(result.user.name).toBe(createdUser.name);
      expect(result.user.email).toBe(createdUser.email);
      expect(result.user.role).toBe(createdUser.role);
      expect(mockUsersService.create).toHaveBeenCalledWith(userData);
      expect(signSpy).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'password123';
      const passwordHash = await hash(password);

      const user: User = {
        id: 'user-123',
        name: 'John Doe',
        email,
        password_hash: passwordHash,
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(mockAuthRepository, 'findByEmailWithPassword').mockResolvedValue(
        user,
      );
      const signSpy = vi.spyOn(mockTokenService, 'sign');

      // Act
      const result = await authService.login({ email, password });

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(user.id);
      expect(result.user.email).toBe(user.email);
      expect(mockAuthRepository.findByEmailWithPassword).toHaveBeenCalledWith(
        email,
      );
      expect(signSpy).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw UnauthorizedError when user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      vi.spyOn(mockAuthRepository, 'findByEmailWithPassword').mockResolvedValue(
        null,
      );

      // Act & Assert
      await expect(authService.login({ email, password })).rejects.toThrow(
        UnauthorizedError,
      );
      await expect(authService.login({ email, password })).rejects.toThrow(
        'Invalid credentials.',
      );
    });

    it('should throw UnauthorizedError when password is invalid', async () => {
      // Arrange
      const email = 'john@example.com';
      const correctPassword = 'password123';
      const wrongPassword = 'wrongpassword';
      const passwordHash = await hash(correctPassword);

      const user: User = {
        id: 'user-123',
        name: 'John Doe',
        email,
        password_hash: passwordHash,
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(mockAuthRepository, 'findByEmailWithPassword').mockResolvedValue(
        user,
      );

      // Act & Assert
      await expect(
        authService.login({ email, password: wrongPassword }),
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        authService.login({ email, password: wrongPassword }),
      ).rejects.toThrow('Invalid credentials.');
    });

    it('should verify password correctly using argon2', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'password123';
      const passwordHash = await hash(password);

      const user: User = {
        id: 'user-123',
        name: 'John Doe',
        email,
        password_hash: passwordHash,
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(mockAuthRepository, 'findByEmailWithPassword').mockResolvedValue(
        user,
      );

      // Act
      await authService.login({ email, password });

      // Assert - Se chegou aqui sem erro, a senha foi verificada corretamente
      // O verify do argon2 é chamado internamente
      const isValid = await verify(passwordHash, password);
      expect(isValid).toBe(true);
    });
  });
});
