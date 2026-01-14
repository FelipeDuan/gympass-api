import type { Prisma } from 'generated/prisma/client';
import { generateRandomString } from '../helpers/test-helpers';

/**
 * Factory para criar dados de academia para testes
 *
 * @param overrides - Valores para sobrescrever os padrões
 * @returns Dados de academia válidos
 */
export const createGymFixture = (
  overrides?: Partial<Prisma.GymCreateInput>,
): Prisma.GymCreateInput => {
  return {
    title: `Gym ${generateRandomString(8)}`,
    description: 'A great gym for training',
    phone: '11999999999',
    latitude: -23.5505,
    longitude: -46.6333,
    ...overrides,
  };
};
