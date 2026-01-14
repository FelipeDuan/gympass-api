/**
 * Módulo de métricas básicas para monitoramento
 *
 * Este módulo coleta métricas básicas da aplicação:
 * - Contadores de requisições
 * - Tempo de resposta
 * - Erros
 *
 * Para produção, considere integrar com Prometheus, Datadog, etc.
 */

interface RequestMetrics {
  count: number;
  totalDuration: number;
  errors: number;
  lastRequestTime?: Date;
}

class MetricsCollector {
  private metrics: Map<string, RequestMetrics> = new Map();

  /**
   * Registra uma requisição
   */
  recordRequest(
    route: string,
    duration: number,
    isError: boolean = false,
  ): void {
    const existing = this.metrics.get(route) || {
      count: 0,
      totalDuration: 0,
      errors: 0,
    };

    existing.count += 1;
    existing.totalDuration += duration;
    existing.lastRequestTime = new Date();

    if (isError) {
      existing.errors += 1;
    }

    this.metrics.set(route, existing);
  }

  /**
   * Obtém métricas de uma rota específica
   */
  getRouteMetrics(route: string): RequestMetrics | null {
    return this.metrics.get(route) || null;
  }

  /**
   * Obtém todas as métricas
   */
  getAllMetrics(): Record<string, RequestMetrics> {
    const result: Record<string, RequestMetrics> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Calcula tempo médio de resposta de uma rota
   */
  getAverageResponseTime(route: string): number {
    const metrics = this.metrics.get(route);
    if (!metrics || metrics.count === 0) {
      return 0;
    }
    return metrics.totalDuration / metrics.count;
  }

  /**
   * Calcula taxa de erro de uma rota
   */
  getErrorRate(route: string): number {
    const metrics = this.metrics.get(route);
    if (!metrics || metrics.count === 0) {
      return 0;
    }
    return (metrics.errors / metrics.count) * 100;
  }

  /**
   * Reseta todas as métricas
   */
  reset(): void {
    this.metrics.clear();
  }
}

export const metricsCollector = new MetricsCollector();

/**
 * Middleware para coletar métricas automaticamente
 */
export function metricsMiddleware(
  route: string,
  duration: number,
  isError: boolean,
): void {
  metricsCollector.recordRequest(route, duration, isError);
}
