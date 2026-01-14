/**
 * Interface para logging - abstração do logger do Fastify
 *
 * Permite desacoplar componentes de infraestrutura específica.
 * Facilita testes e permite trocar implementação de logger sem modificar código dependente.
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(private logger: ILogger) {}
 *
 *   doSomething() {
 *     this.logger.info({ msg: 'Doing something' });
 *   }
 * }
 * ```
 */
export interface ILogger {
  /**
   * Log de informação
   * @param data - Dados a serem logados (objeto ou string)
   */
  info(data: unknown): void;

  /**
   * Log de aviso
   * @param data - Dados a serem logados (objeto ou string)
   */
  warn(data: unknown): void;

  /**
   * Log de erro
   * @param data - Dados a serem logados (objeto ou string)
   */
  error(data: unknown): void;

  /**
   * Log fatal (erro crítico)
   * @param message - Mensagem de erro fatal
   */
  fatal(message: string): void;

  /**
   * Log de debug (opcional)
   * @param data - Dados a serem logados (objeto ou string)
   */
  debug?(data: unknown): void;
}
