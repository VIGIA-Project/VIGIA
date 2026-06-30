import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@core/database/database.service';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  checks: Record<string, ComponentHealth>;
}

export interface ComponentHealth {
  status: 'up' | 'down' | 'degraded';
  message?: string;
  responseTime?: number;
  details?: Record<string, unknown>;
}

@Injectable()
export class HealthService {
  private readonly startTime: Date;

  constructor(private readonly databaseService: DatabaseService) {
    this.startTime = new Date();
  }

  async getFullHealth(): Promise<HealthStatus> {
    const checks: Record<string, ComponentHealth> = {};

    checks.database = await this.checkDatabase();
    checks.memory = this.checkMemory();
    checks.uptime = this.checkUptime();

    const allUp = Object.values(checks).every((c) => c.status === 'up');
    const anyDown = Object.values(checks).some((c) => c.status === 'down');

    return {
      status: allUp ? 'healthy' : anyDown ? 'unhealthy' : 'degraded',
      uptime: this.getUptimeSeconds(),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? '0.1.0',
      checks,
    };
  }

  async getLiveness(): Promise<{ alive: boolean; timestamp: string }> {
    // Liveness: ¿está el proceso vivo?
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<{ ready: boolean; timestamp: string; checks: Record<string, ComponentHealth> }> {
    // Readiness: ¿está listo para recibir tráfico?
    const dbHealth = await this.checkDatabase();
    const ready = dbHealth.status === 'up';

    return {
      ready,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth,
      },
    };
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      const isHealthy = await this.databaseService.isHealthy();
      return {
        status: isHealthy ? 'up' : 'down',
        responseTime: Date.now() - start,
        message: isHealthy ? 'Conexión OK' : 'Sin conexión',
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private checkMemory(): ComponentHealth {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);

    const heapThresholdMB = parseInt(
      process.env.HEALTH_MEMORY_HEAP_THRESHOLD ?? '300',
      10,
    );

    return {
      status: heapUsedMB < heapThresholdMB ? 'up' : 'degraded',
      details: {
        heapUsedMB,
        heapTotalMB,
        rssMB,
        heapUsagePercent: Math.round((heapUsedMB / heapTotalMB) * 100),
      },
    };
  }

  private checkUptime(): ComponentHealth {
    return {
      status: 'up',
      details: {
        uptimeSeconds: this.getUptimeSeconds(),
        startedAt: this.startTime.toISOString(),
      },
    };
  }

  private getUptimeSeconds(): number {
    return Math.round((Date.now() - this.startTime.getTime()) / 1000);
  }
}
