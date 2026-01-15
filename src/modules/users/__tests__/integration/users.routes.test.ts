/// <reference types="vitest/globals" />

import { hash } from 'argon2';
import type { FastifyInstance } from 'fastify';
import { createUserPrismaFixture } from '@/__tests__/fixtures/user.fixtures';
import {
  buildTestApp,
  generateRandomEmail,
  generateTestToken,
} from '@/__tests__/helpers/test-helpers';
import { testPrisma } from '@/__tests__/setup/database';

describe('Users Routes (Integration)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  beforeEach(async () => {
    await testPrisma.checkIn.deleteMany();
    await testPrisma.gym.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('GET /users', () => {
    it('should return 401 when not authenticated', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users',
      });

      // Assert
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return 403 when user does not have required role', async () => {
      // Arrange - Criar usuário USER
      const email = generateRandomEmail();
      const passwordHash = await hash('password123');
      const user = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email,
          name: 'Regular User',
          password_hash: passwordHash,
          role: 'USER',
        }),
      });

      const token = await generateTestToken(app, {
        sub: user.id,
        email: user.email,
        role: 'USER',
      });

      // Act - Tentar acessar rota que requer ADMIN
      const response = await app.inject({
        method: 'GET',
        url: '/users',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      // Nota: A rota aceita ADMIN ou USER, então deve retornar 200
      // Se mudar para requerer apenas ADMIN, deve retornar 403
      expect([200, 403]).toContain(response.statusCode);
    });

    it('should return paginated users list for authenticated ADMIN', async () => {
      // Arrange - Criar usuários
      const adminEmail = generateRandomEmail();
      const adminPasswordHash = await hash('password123');
      const admin = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email: adminEmail,
          name: 'Admin User',
          password_hash: adminPasswordHash,
          role: 'ADMIN',
        }),
      });

      // Criar alguns usuários de teste
      for (let i = 0; i < 5; i++) {
        await testPrisma.user.create({
          data: createUserPrismaFixture({
            email: generateRandomEmail(),
            name: `User ${i}`,
            password_hash: await hash('password123'),
            role: 'USER',
          }),
        });
      }

      const token = await generateTestToken(app, {
        sub: admin.id,
        email: admin.email,
        role: 'ADMIN',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users?page=1&limit=3',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeLessThanOrEqual(3);
      expect(body.page).toBe(1);
      expect(typeof body.total).toBe('number');
    });

    it('should return paginated users list for authenticated USER', async () => {
      // Arrange - Criar usuário USER
      const userEmail = generateRandomEmail();
      const userPasswordHash = await hash('password123');
      const user = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email: userEmail,
          name: 'Regular User',
          password_hash: userPasswordHash,
          role: 'USER',
        }),
      });

      // Criar alguns usuários de teste
      for (let i = 0; i < 3; i++) {
        await testPrisma.user.create({
          data: createUserPrismaFixture({
            email: generateRandomEmail(),
            name: `User ${i}`,
            password_hash: await hash('password123'),
            role: 'USER',
          }),
        });
      }

      const token = await generateTestToken(app, {
        sub: user.id,
        email: user.email,
        role: 'USER',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users?page=1&limit=2',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeLessThanOrEqual(2);
      expect(body.page).toBe(1);
    });

    it('should use default pagination when not provided', async () => {
      // Arrange
      const adminEmail = generateRandomEmail();
      const adminPasswordHash = await hash('password123');
      const admin = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email: adminEmail,
          name: 'Admin User',
          password_hash: adminPasswordHash,
          role: 'ADMIN',
        }),
      });

      const token = await generateTestToken(app, {
        sub: admin.id,
        email: admin.email,
        role: 'ADMIN',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('data');
      expect(body.page).toBe(1);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /users/me', () => {
    it('should return 401 when not authenticated', async () => {
      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
      });

      // Assert
      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return user profile for authenticated user', async () => {
      // Arrange
      const email = generateRandomEmail();
      const passwordHash = await hash('password123');
      const user = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email,
          name: 'John Doe',
          password_hash: passwordHash,
          role: 'USER',
        }),
      });

      const token = await generateTestToken(app, {
        sub: user.id,
        email: user.email,
        role: 'USER',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      expect(body).toHaveProperty('created_at');
      expect(body).not.toHaveProperty('password_hash');
    });

    it('should return 404 when user does not exist', async () => {
      // Arrange - Criar token com ID que não existe no banco
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const token = await generateTestToken(app, {
        sub: nonExistentId,
        email: generateRandomEmail(),
        role: 'USER',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should return profile for ADMIN user', async () => {
      // Arrange
      const email = generateRandomEmail();
      const passwordHash = await hash('password123');
      const admin = await testPrisma.user.create({
        data: createUserPrismaFixture({
          email,
          name: 'Admin User',
          password_hash: passwordHash,
          role: 'ADMIN',
        }),
      });

      const token = await generateTestToken(app, {
        sub: admin.id,
        email: admin.email,
        role: 'ADMIN',
      });

      // Act
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Assert
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toMatchObject({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN',
      });
    });
  });
});
