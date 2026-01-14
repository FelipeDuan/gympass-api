/// <reference types="vitest/globals" />

import { hash } from 'argon2';
import { createUserPrismaFixture } from '@/__tests__/fixtures/user.fixtures';
import { testPrisma } from '@/__tests__/setup/database';
import { authRepository } from '../../auth.repository';

describe('AuthRepository (Integration)', () => {
  beforeEach(async () => {
    // Limpeza adicional para garantir isolamento
    await testPrisma.checkIn.deleteMany();
    await testPrisma.gym.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('findByEmailWithPassword', () => {
    it('should find user by email with password hash', async () => {
      // Arrange
      const uniqueEmail = `test-${Date.now()}-${Math.random()}@example.com`;
      const passwordHash = await hash('password123');
      const userData = createUserPrismaFixture({
        email: uniqueEmail,
        name: 'Test User',
      });
      userData.password_hash = passwordHash;

      const createdUser = await testPrisma.user.create({
        data: userData,
      });

      // Act
      const foundUser =
        await authRepository.findByEmailWithPassword(uniqueEmail);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(uniqueEmail);
      expect(foundUser?.name).toBe('Test User');
      expect(foundUser).toHaveProperty('password_hash');
      expect(foundUser?.password_hash).toBe(passwordHash);
    });

    it('should return null when user not found', async () => {
      // Act
      const foundUser = await authRepository.findByEmailWithPassword(
        'nonexistent@example.com',
      );

      // Assert
      expect(foundUser).toBeNull();
    });

    it('should return all user fields including password_hash', async () => {
      // Arrange
      const uniqueEmail = `test-admin-${Date.now()}-${Math.random()}@example.com`;
      const passwordHash = await hash('password123');
      const userData = createUserPrismaFixture({
        email: uniqueEmail,
        name: 'Test User',
        role: 'ADMIN',
      });
      userData.password_hash = passwordHash;

      const createdUser = await testPrisma.user.create({
        data: userData,
      });

      // Act
      const foundUser =
        await authRepository.findByEmailWithPassword(uniqueEmail);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(uniqueEmail);
      expect(foundUser?.name).toBe('Test User');
      expect(foundUser?.role).toBe('ADMIN');
      expect(foundUser?.password_hash).toBe(passwordHash);
      expect(foundUser?.created_at).toBeInstanceOf(Date);
      expect(foundUser?.updated_at).toBeInstanceOf(Date);
    });
  });
});
