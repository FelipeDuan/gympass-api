/**
 * Interfaces e Contratos
 *
 * Define contratos para desacoplar implementações concretas.
 * Permite trocar implementações sem modificar código que depende delas.
 * Facilita testes e mantém código testável.
 */

export * from './auth.repository.interface';
export * from './cache.interface';
export * from './logger.interface';
export * from './token.interface';
export * from './users.repository.interface';
export * from './users.service.interface';
