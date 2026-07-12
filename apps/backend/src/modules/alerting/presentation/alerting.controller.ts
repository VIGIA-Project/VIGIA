import { Controller, Get, Patch, Param, Query, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AlertingService } from '../application/alerting.service';

@Controller('alerting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  private personaIdDesdeJwt(req: any): string {
    const personaId = req.user?.personaId;
    if (!personaId) {
      throw new BadRequestException(
        'El usuario autenticado no tiene una persona asociada (personaId ausente en el token)',
      );
    }
    return personaId;
  }

  // ─── Alertas ────────────────────────────────────────────────────────────

  @Get('alertas/recientes')
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async listarAlertasRecientes(@Query('limite') limite?: string) {
    const cantidad = limite ? parseInt(limite, 10) : 10;
    const alertas = await this.alertingService.listarRecientes(cantidad);
    return alertas.map((a) => a.toJSON());
  }

  @Get('alertas/count')
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async contarAlertas() {
    const count = await this.alertingService.contarNoResueltas();
    return { count };
  }

  @Patch('alertas/:id/atender')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async marcarAlertaAtendida(@Param('id') id: string) {
    const alerta = await this.alertingService.marcarAlertaAtendida(id);
    return alerta.toJSON();
  }

  // ─── Notificaciones ─────────────────────────────────────────────────────

  @Get('notificaciones')
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async listarNotificaciones(@Request() req: any) {
    const notificaciones = await this.alertingService.listarPorDestinatario(
      this.personaIdDesdeJwt(req),
    );
    return notificaciones.map((n) => n.toJSON());
  }

  @Patch('notificaciones/:id/leer')
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async marcarNotificacionLeida(@Param('id') id: string) {
    const notificacion = await this.alertingService.marcarLeida(id);
    return notificacion.toJSON();
  }
}
