import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService, HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /health
   * Estado completo del sistema con todos los checks.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.getFullHealth();
  }

  /**
   * GET /health/liveness
   * Verifica que el proceso está vivo (para Kubernetes liveness probe).
   */
  @Get('liveness')
  @HttpCode(HttpStatus.OK)
  async getLiveness(): Promise<{ alive: boolean; timestamp: string }> {
    return this.healthService.getLiveness();
  }

  /**
   * GET /health/readiness
   * Verifica que el servicio está listo para recibir tráfico (readiness probe).
   */
  @Get('readiness')
  async getReadiness() {
    const result = await this.healthService.getReadiness();
    // Si no está listo, devolvemos 503
    if (!result.ready) {
      return { ...result, statusCode: HttpStatus.SERVICE_UNAVAILABLE };
    }
    return result;
  }
}
