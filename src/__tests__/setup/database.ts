import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

/**
 * Cliente Prisma isolado para testes
 *
 * Usa DATABASE_URL de teste (configurado via variável de ambiente).
 * Mantém o mesmo padrão de produção para consistência.
 *
 * IMPORTANTE: Este arquivo é importado após o .env.test ser carregado
 * no vitest-setup.ts, então process.env já está populado.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required for tests. Create .env.test file based on .env.test.example',
  );
}

const adapter = new PrismaPg({ connectionString });

export const testPrisma = new PrismaClient({
  adapter,
  log: [],
});

/**
 * Limpa todas as tabelas do banco de dados de teste
 *
 * IMPORTANTE: Usar apenas em ambiente de teste!
 * Ordem de deleção respeita constraints de foreign key.
 */
export async function cleanDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('cleanDatabase should only be called in test environment');
  }

  await testPrisma.checkIn.deleteMany();
  await testPrisma.gym.deleteMany();
  await testPrisma.user.deleteMany();
}

/**
 * Fecha conexão com o banco de dados de teste
 */
export async function closeDatabase(): Promise<void> {
  await testPrisma.$disconnect();
}
