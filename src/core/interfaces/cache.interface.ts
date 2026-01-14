/**
 * Interface para serviços de cache
 *
 * Abstração para diferentes implementações de cache (Redis, Memória, Memcached, etc).
 * Permite trocar implementação sem modificar código que depende dela.
 * Facilita testes ao permitir mockar o cache.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(private cache: ICacheService) {}
 *
 *   async getData(key: string) {
 *     const cached = await this.cache.get<MyData>(key);
 *     if (cached) return cached;
 *
 *     const data = await fetchData();
 *     await this.cache.set(key, data, 300); // 5 minutos
 *     return data;
 *   }
 * }
 * ```
 */
export interface ICacheService {
  /**
   * Obtém um valor do cache
   *
   * @param key - Chave do cache
   * @returns Valor encontrado ou null se não existir
   *
   * @example
   * ```typescript
   * const user = await cache.get<UserDTO>('user:123');
   * ```
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Armazena um valor no cache
   *
   * @param key - Chave do cache
   * @param value - Valor a ser armazenado
   * @param expirationInSeconds - Tempo de expiração em segundos
   *
   * @example
   * ```typescript
   * await cache.set('user:123', userData, 300); // 5 minutos
   * ```
   */
  set(key: string, value: unknown, expirationInSeconds: number): Promise<void>;

  /**
   * Invalida todas as chaves que correspondem ao padrão
   *
   * @param pattern - Padrão de chaves a invalidar (ex: 'users:list:*')
   *
   * @example
   * ```typescript
   * // Invalida todas as listagens de usuários
   * await cache.invalidateByPattern('users:list:*');
   * ```
   */
  invalidateByPattern(pattern: string): Promise<void>;
}
