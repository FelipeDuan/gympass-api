import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { env } from '@/config/env';

/**
 * Cliente Prisma isolado para testes
 *
 * Usa DATABASE_URL de teste (configurado via variável de ambiente).
 * Mantém o mesmo padrão de produção para consistência.
 */
const connectionString = env.DATABASE_URL;
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
  if (env.NODE_ENV !== 'test') {
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
