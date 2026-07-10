import { Controller, Get, Query } from '@nestjs/common';
import { AlertingService } from '../application/alerting.service';

@Controller('alerting')
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  @Get('alertas/recientes')
  async obtenerAlertasRecientes(@Query('limite') limite?: string) {
    const lim = limite ? parseInt(limite, 10) : 6;
    return this.alertingService.obtenerAlertasRecientes(lim);
  }

  @Get('alertas/count')
  async contarAlertas() {
    const total = await this.alertingService.contarTotalAlertas();
    return { count: total };
  }
}
