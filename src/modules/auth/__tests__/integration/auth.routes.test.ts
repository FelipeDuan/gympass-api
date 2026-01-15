/// <reference types="vitest/globals" />

import { hash } from 'argon2';
import type { FastifyInstance } from 'fastify';
import { createUserPrismaFixture } from '@/__tests__/fixtures/user.fixtures';
import {
  buildTestApp,
  generateRandomEmail,
} from '@/__tests__/helpers/test-helpers';
import { testPrisma } from '@/__tests__/setup/database';

describe('Auth Routes (Integration)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  beforeEach(async () => {
    await testPrisma.checkIn.deleteMany();
    await testPrisma.gym.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: generateRandomEmail(),
        password: 'password123',
      };

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Assert
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
      expect(body.user).toMatchObject({
        name: userData.name,
        email: userData.email,
        role: 'USER',
      });
      expect(body.user).toHaveProperty('id');
      expect(typeof body.token).toBe('string');
    });

    it('should return 400 for invalid email', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 400 for password too short', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: generateRandomEmail(),
        password: '12345', // Menos de 6 caracteres
      };

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 400 for name too short', async () => {
      // Arrange
      const userData = {
        name: 'Jo', // Menos de 3 caracteres
        email: generateRandomEmail(),
        password: 'password123',
      };

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const email = generateRandomEmail();
      const userData = {
        name: 'John Doe',
        email,
        password: 'password123',
      };

      // Criar primeiro usuário
      await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Act - Tentar criar segundo usuário com mesmo email
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: userData,
      });

      // Assert
      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('email');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const email = generateRandomEmail();
      const password = 'password123';
      const passwordHash = await hash(password);

      // Criar usuário no banco
      await testPrisma.user.create({
        data: createUserPrismaFixture({
          email,
          name: 'John Doe',
          password_hash: passwordHash,
        }),
      });

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
      expect(body.user).toMatchObject({
        email,
        name: 'John Doe',
      });
      expect(body.user).toHaveProperty('id');
      expect(typeof body.token).toBe('string');
    });

    it('should return 401 for invalid email', async () => {
      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });

      // Assert
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 401 for invalid password', async () => {
      // Arrange
      const email = generateRandomEmail();
      const passwordHash = await hash('correctpassword');

      // Criar usuário no banco
      await testPrisma.user.create({
        data: createUserPrismaFixture({
          email,
          name: 'John Doe',
          password_hash: passwordHash,
        }),
      });

      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password: 'wrongpassword',
        },
      });

      // Assert
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'invalid-email',
          password: 'password123',
        },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 400 for password too short', async () => {
      // Act
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: generateRandomEmail(),
          password: '12345', // Menos de 6 caracteres
        },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });
  });
});
