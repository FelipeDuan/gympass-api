import type { CreateUserSchema } from '@/modules/users/users.schemas';
import {
  generateRandomEmail,
  generateRandomString,
} from '../helpers/test-helpers';

export const createUserFixture = (
  overrides?: Partial<CreateUserSchema>,
): CreateUserSchema => {
  return {
    name: 'John Doe',
    email: generateRandomEmail(),
    password: generateRandomString(),
    ...overrides,
  };
};
