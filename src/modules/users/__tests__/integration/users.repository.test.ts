/// <reference types="vitest/globals" />

import { hash } from 'argon2';
import { createUserPrismaFixture } from '@/__tests__/fixtures/user.fixtures';
import { testPrisma } from '@/__tests__/setup/database';
import type { UserDTO } from '../../users.dto';
import { createUsersRepository } from '../../users.repository';

describe('UsersRepository (Integration)', () => {
  // Cria instância do repository usando testPrisma para isolamento
  const usersRepository = createUsersRepository(testPrisma);

  beforeEach(async () => {
    // Limpeza adicional para garantir isolamento
    await testPrisma.checkIn.deleteMany();
    await testPrisma.gym.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const uniqueEmail = `test-${Date.now()}-${Math.random()}@example.com`;
      const userData = createUserPrismaFixture({
        email: uniqueEmail,
        name: 'Test User',
      });
      userData.password_hash = await hash('password123');

      const createdUser = await testPrisma.user.create({
        data: userData,
      });

      // Act
      const foundUser = await usersRepository.findByEmail(uniqueEmail);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(uniqueEmail);
      expect(foundUser?.name).toBe('Test User');
      expect(foundUser).not.toHaveProperty('password_hash');
    });

    it('should return null when user not found', async () => {
      // Act
      const foundUser = await usersRepository.findByEmail(
        'nonexistent@example.com',
      );

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      // Arrange
      const userData = createUserPrismaFixture({
        email: 'test@example.com',
        name: 'Test User',
      });
      userData.password_hash = await hash('password123');

      const createdUser = await testPrisma.user.create({
        data: userData,
      });

      // Act
      const foundUser = await usersRepository.findById(createdUser.id);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe('test@example.com');
      expect(foundUser?.name).toBe('Test User');
      expect(foundUser).not.toHaveProperty('password_hash');
    });

    it('should return null when user not found', async () => {
      // Act
      const foundUser = await usersRepository.findById('non-existent-id');

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = createUserPrismaFixture({
        email: 'newuser@example.com',
        name: 'New User',
      });
      userData.password_hash = await hash('password123');

      // Act
      const createdUser = await usersRepository.create(userData);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe('newuser@example.com');
      expect(createdUser.name).toBe('New User');
      expect(createdUser.role).toBe('USER');
      expect(createdUser.created_at).toBeInstanceOf(Date);
      expect(createdUser).not.toHaveProperty('password_hash');

      // Verify in database
      const dbUser = await testPrisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe('newuser@example.com');
    });

    it('should create user with ADMIN role when specified', async () => {
      // Arrange
      const userData = createUserPrismaFixture({
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
      });
      userData.password_hash = await hash('password123');

      // Act
      const createdUser = await usersRepository.create(userData);

      // Assert
      expect(createdUser.role).toBe('ADMIN');
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Arrange
      const users = [];
      for (let i = 0; i < 5; i++) {
        const userData = createUserPrismaFixture({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
        userData.password_hash = await hash('password123');
        const user = await testPrisma.user.create({ data: userData });
        users.push(user);
      }

      // Act
      const result = await usersRepository.findAll(0, 3);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).not.toHaveProperty('password_hash');
    });

    it('should return empty array when no users exist', async () => {
      // Act
      const result = await usersRepository.findAll(0, 10);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should respect skip parameter', async () => {
      // Arrange
      const users = [];
      for (let i = 0; i < 5; i++) {
        const userData = createUserPrismaFixture({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
        userData.password_hash = await hash('password123');
        const user = await testPrisma.user.create({ data: userData });
        users.push(user);
      }

      // Act
      const result = await usersRepository.findAll(2, 2);

      // Assert
      expect(result).toHaveLength(2);
    });

    it('should order by created_at desc', async () => {
      // Arrange
      const users = [];
      for (let i = 0; i < 3; i++) {
        const userData = createUserPrismaFixture({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
        userData.password_hash = await hash('password123');
        const user = await testPrisma.user.create({ data: userData });
        users.push(user);
        // Small delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // Act
      const result = await usersRepository.findAll(0, 10);

      // Assert - Most recent first
      expect(result[0].id).toBe(users[2].id);
      expect(result[1].id).toBe(users[1].id);
      expect(result[2].id).toBe(users[0].id);
    });
  });

  describe('count', () => {
    it('should return total count of users', async () => {
      // Arrange
      for (let i = 0; i < 3; i++) {
        const userData = createUserPrismaFixture({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
        userData.password_hash = await hash('password123');
        await testPrisma.user.create({ data: userData });
      }

      // Act
      const count = await usersRepository.count();

      // Assert
      expect(count).toBe(3);
    });

    it('should return 0 when no users exist', async () => {
      // Act
      const count = await usersRepository.count();

      // Assert
      expect(count).toBe(0);
    });
  });
});
