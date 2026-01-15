/// <reference types="vitest/globals" />

import type { FastifyInstance } from 'fastify';
import { buildTestApp, generateRandomEmail } from '../helpers/test-helpers';

describe('Auth Flow E2E', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
    // Garante que o app está pronto para receber requisições
    await app.ready();
  });

  describe('Complete Authentication Flow', () => {
    it('should complete full flow: register -> login -> access protected route', async () => {
      const email = generateRandomEmail();
      const password = 'password123';
      const name = 'Test User';

      // Step 1: Register - Usa app.inject do Fastify (mais compatível)
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name,
          email,
          password,
        },
      });

      expect(registerResponse.statusCode).toBe(201);
      const registerBody = JSON.parse(registerResponse.body);
      expect(registerBody).toHaveProperty('token');
      expect(registerBody).toHaveProperty('user');
      expect(registerBody.user.email).toBe(email);
      expect(registerBody.user.name).toBe(name);

      const registerToken = registerBody.token;

      // Step 2: Login
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password,
        },
      });

      expect(loginResponse.statusCode).toBe(200);
      const loginBody = JSON.parse(loginResponse.body);
      expect(loginBody).toHaveProperty('token');
      expect(loginBody).toHaveProperty('user');
      expect(loginBody.user.email).toBe(email);

      const loginToken = loginBody.token;

      // Step 3: Access protected route with register token
      const profileResponse1 = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${registerToken}`,
        },
      });

      expect(profileResponse1.statusCode).toBe(200);
      const profileBody1 = JSON.parse(profileResponse1.body);
      expect(profileBody1.email).toBe(email);
      expect(profileBody1.name).toBe(name);

      // Step 4: Access protected route with login token
      const profileResponse2 = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${loginToken}`,
        },
      });

      expect(profileResponse2.statusCode).toBe(200);
      const profileBody2 = JSON.parse(profileResponse2.body);
      expect(profileBody2.email).toBe(email);
    });

    it('should fail to access protected route without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should fail to access protected route with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message');
    });

    it('should allow access to public routes without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('status');
    });
  });

  describe('User Registration and Profile Flow', () => {
    it('should register user and retrieve profile', async () => {
      const email = generateRandomEmail();
      const password = 'password123';
      const name = 'Profile Test User';

      // Register
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name,
          email,
          password,
        },
      });

      expect(registerResponse.statusCode).toBe(201);
      const registerBody = JSON.parse(registerResponse.body);
      const token = registerBody.token;

      // Get profile
      const profileResponse = await app.inject({
        method: 'GET',
        url: '/users/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(profileResponse.statusCode).toBe(200);
      const profileBody = JSON.parse(profileResponse.body);
      expect(profileBody).toMatchObject({
        email,
        name,
        role: 'USER',
      });
      expect(profileBody).toHaveProperty('id');
      expect(profileBody).toHaveProperty('created_at');
      expect(profileBody).not.toHaveProperty('password_hash');
    });
  });
});
