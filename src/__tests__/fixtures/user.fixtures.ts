import type { Prisma } from 'generated/prisma/client';
import type { CreateUserSchema } from '@/modules/users/users.schemas';
import {
  generateRandomEmail,
  generateRandomString,
} from '../helpers/test-helpers';

/**
 * Factory para criar dados de usuário para testes
 *
 * @param overrides - Valores para sobrescrever os padrões
 * @returns Dados de usuário válidos
 *
 * @example
 * ```typescript
 * const userData = createUserFixture({ email: 'test@example.com' });
 * ```
 */
export const createUserFixture = (
  overrides?: Partial<CreateUserSchema>,
): CreateUserSchema => {
  return {
    name: 'John Doe',
    email: generateRandomEmail(),
    password: generateRandomString(12),
    ...overrides,
  };
};

/**
 * Factory para criar dados de usuário para Prisma (com password_hash)
 *
 * @param overrides - Valores para sobrescrever os padrões
 * @returns Dados de usuário para Prisma
 *
 * @example
 * ```typescript
 * const userData = createUserPrismaFixture({ email: 'test@example.com' });
 * await prisma.user.create({ data: userData });
 * ```
 */
export const createUserPrismaFixture = (
  overrides?: Partial<Prisma.UserCreateInput>,
): Prisma.UserCreateInput => {
  return {
    name: 'John Doe',
    email: generateRandomEmail(),
    password_hash: 'hashed_password_placeholder',
    role: 'USER',
    ...overrides,
  };
};
