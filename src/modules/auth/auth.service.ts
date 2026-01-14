import { verify } from 'argon2';
import type { Role } from 'generated/prisma/client';
import type { IAuthRepository } from '@/core/interfaces/auth.repository.interface';
import type { ITokenService } from '@/core/interfaces/token.interface';
import type { IUsersService } from '@/core/interfaces/users.service.interface';
import { UnauthorizedError } from '@/http/errors/app-error';
import type { LoginSchema, RegisterSchema } from './auth.schemas';

/**
 * Service de autenticação
 *
 * @example
 * ```typescript
 * const tokenService = new JwtTokenService(app.jwt);
 * const authService = new AuthService(tokenService, usersService);
 * ```
 */
export class AuthService {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly usersService: IUsersService,
    private readonly authRepository: IAuthRepository,
  ) {}

  async register(data: RegisterSchema): Promise<{
    token: string;
    user: { id: string; name: string; email: string; role: Role };
  }> {
    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const token = this.tokenService.sign({
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
  }

  async login(data: LoginSchema): Promise<{
    token: string;
    user: { id: string; name: string; email: string; role: Role };
  }> {
    const userWithPassword = await this.authRepository.findByEmailWithPassword(
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

    const token = this.tokenService.sign({
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
  }
}
