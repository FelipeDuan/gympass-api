/// <reference types="vitest/globals" />

import { createUserFixture } from '@/__tests__/fixtures/user.fixtures';
import {
  createMockCacheService,
  createMockUsersRepository,
} from '@/__tests__/helpers/mocks';
import { CACHE_TTL } from '@/core/shared/constants';
import { ConflictError, ResourceNotFoundError } from '@/http/errors/app-error';
import type { UserDTO } from '../../users.dto';
import { UsersService } from '../../users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockCache: ReturnType<typeof createMockCacheService>;
  let mockRepository: ReturnType<typeof createMockUsersRepository>;

  beforeEach(() => {
    mockCache = createMockCacheService();
    mockRepository = createMockUsersRepository();
    usersService = new UsersService(mockCache, mockRepository);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = createUserFixture({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValue(null);
      vi.spyOn(mockRepository, 'create').mockResolvedValue({
        id: 'user-123',
        name: userData.name,
        email: userData.email,
        role: 'USER',
        created_at: new Date(),
      } as UserDTO);

      const invalidateSpy = vi.spyOn(mockCache, 'invalidateByPattern');

      // Act
      const result = await usersService.create(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
      expect(result.name).toBe(userData.name);
      expect(result.email).toBe(userData.email);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
        }),
      );
      expect(invalidateSpy).toHaveBeenCalledWith('users:list:*');
    });

    it('should throw ConflictError when email already exists', async () => {
      // Arrange
      const userData = createUserFixture({
        email: 'existing@example.com',
      });

      const existingUser = {
        id: 'existing-123',
        name: 'Existing User',
        email: 'existing@example.com',
        role: 'USER' as const,
        created_at: new Date(),
      } as UserDTO;

      const findByEmailSpy = vi
        .spyOn(mockRepository, 'findByEmail')
        .mockResolvedValue(existingUser);
      const createSpy = vi.spyOn(mockRepository, 'create');

      // Act & Assert
      await expect(usersService.create(userData)).rejects.toThrow(
        ConflictError,
      );
      await expect(usersService.create(userData)).rejects.toThrow(
        'User with same email already exists.',
      );
      expect(findByEmailSpy).toHaveBeenCalledWith(userData.email);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should hash password before creating user', async () => {
      // Arrange
      const userData = createUserFixture({
        password: 'plainpassword',
      });

      vi.spyOn(mockRepository, 'findByEmail').mockResolvedValue(null);
      const createSpy = vi.spyOn(mockRepository, 'create').mockResolvedValue({
        id: 'user-123',
        name: userData.name,
        email: userData.email,
        role: 'USER',
        created_at: new Date(),
      } as UserDTO);

      // Act
      await usersService.create(userData);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          password_hash: expect.any(String),
        }),
      );
      const callArgs = createSpy.mock.calls[0][0];
      expect(callArgs.password_hash).not.toBe('plainpassword');
      expect(callArgs.password_hash.length).toBeGreaterThan(20);
    });
  });

  describe('findAll', () => {
    it('should return paginated users from repository', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const users: UserDTO[] = [
        {
          id: 'user-1',
          name: 'User 1',
          email: 'user1@example.com',
          role: 'USER',
          created_at: new Date(),
        },
        {
          id: 'user-2',
          name: 'User 2',
          email: 'user2@example.com',
          role: 'USER',
          created_at: new Date(),
        },
      ];

      vi.spyOn(mockCache, 'get').mockResolvedValue(null);
      vi.spyOn(mockRepository, 'findAll').mockResolvedValue(users);
      vi.spyOn(mockRepository, 'count').mockResolvedValue(2);
      const setSpy = vi.spyOn(mockCache, 'set');

      // Act
      const result = await usersService.findAll(page, limit);

      // Assert
      expect(result).toBeDefined();
      expect(result.page).toBe(page);
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalledWith(0, limit);
      expect(mockRepository.count).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith(
        `users:list:page:${page}:limit:${limit}`,
        result,
        CACHE_TTL.USER_LIST,
      );
    });

    it('should return cached data when available', async () => {
      // Arrange
      const page = 1;
      const limit = 10;
      const cachedData = {
        page: 1,
        total: 5,
        data: [],
      };

      const getSpy = vi.spyOn(mockCache, 'get').mockResolvedValue(cachedData);
      const findAllSpy = vi.spyOn(mockRepository, 'findAll');
      const countSpy = vi.spyOn(mockRepository, 'count');

      // Act
      const result = await usersService.findAll(page, limit);

      // Assert
      expect(result).toBe(cachedData);
      expect(getSpy).toHaveBeenCalledWith(
        `users:list:page:${page}:limit:${limit}`,
      );
      expect(findAllSpy).not.toHaveBeenCalled();
      expect(countSpy).not.toHaveBeenCalled();
    });

    it('should calculate skip correctly for pagination', async () => {
      // Arrange
      const page = 3;
      const limit = 10;
      const expectedSkip = (page - 1) * limit; // 20

      vi.spyOn(mockCache, 'get').mockResolvedValue(null);
      vi.spyOn(mockRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(mockRepository, 'count').mockResolvedValue(0);

      // Act
      await usersService.findAll(page, limit);

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith(expectedSkip, limit);
    });
  });

  describe('findById', () => {
    it('should return serialized user when found', async () => {
      // Arrange
      const userId = 'user-123';
      const user: UserDTO = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        created_at: new Date('2024-01-01T00:00:00Z'),
      };

      vi.spyOn(mockRepository, 'findById').mockResolvedValue(user);

      // Act
      const result = await usersService.findById(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
      expect(result.created_at).toBe(user.created_at.toISOString());
      expect(mockRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw ResourceNotFoundError when user not found', async () => {
      // Arrange
      const userId = 'non-existent';

      vi.spyOn(mockRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(usersService.findById(userId)).rejects.toThrow(
        ResourceNotFoundError,
      );
      await expect(usersService.findById(userId)).rejects.toThrow(
        'User not found.',
      );
    });
  });
});
