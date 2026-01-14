import { verify } from 'argon2';
import type { FastifyInstance } from 'fastify';
import type { Role } from 'generated/prisma/client';
import { UnauthorizedError } from '@/http/errors/app-error';
import { usersService } from '../users/users.service';
import { authRepository } from './auth.repository';
import type { LoginSchema, RegisterSchema } from './auth.schemas';

export const authService = {
  async register(
    app: FastifyInstance,
    data: RegisterSchema,
  ): Promise<{
    token: string;
    user: { id: string; name: string; email: string; role: Role };
  }> {
    const user = await usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const token = app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(
    app: FastifyInstance,
    data: LoginSchema,
  ): Promise<{
    token: string;
    user: { id: string; name: string; email: string; role: Role };
  }> {
    const userWithPassword = await authRepository.findByEmailWithPassword(
      data.email,
    );

    if (!userWithPassword) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const isPasswordValid = await verify(
      userWithPassword.password_hash,
      data.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const token = app.jwt.sign({
      sub: userWithPassword.id,
      email: userWithPassword.email,
      role: userWithPassword.role,
    });

    return {
      token,
      user: {
        id: userWithPassword.id,
        name: userWithPassword.name,
        email: userWithPassword.email,
        role: userWithPassword.role,
      },
    };
  },
};
