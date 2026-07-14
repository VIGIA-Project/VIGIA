import { Controller, Get, Patch, Param, Query, Request, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AlertingService } from '../application/alerting.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('alerting')
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  @Sse('stream')
  @UseGuards(JwtAuthGuard)
  streamAlerts(): Observable<MessageEvent> {
    return this.alertingService.alertas$.pipe(
      map((alerta) => ({ data: alerta.toJSON() } as MessageEvent)),
    );
  }

  // ─── Alertas ────────────────────────────────────────────────────────────

  @Get('alertas/recientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async listarAlertasRecientes(@Query('limite') limite?: string) {
    const cantidad = limite ? parseInt(limite, 10) : 10;
    const alertas = await this.alertingService.listarRecientes(cantidad);
    return alertas.map((a) => a.toJSON());
  }

  @Get('alertas/count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async contarAlertas() {
    const count = await this.alertingService.contarNoResueltas();
    return { count };
  }

  @Patch('alertas/:id/atender')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async marcarAlertaAtendida(@Param('id') id: string) {
    const alerta = await this.alertingService.marcarAtendida(id);
    return alerta.toJSON();
  }

  @Get('alertas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async buscarAlertaPorId(@Param('id') id: string) {
    const alerta = await this.alertingService.buscarPorId(id);
    return alerta.toJSON();
  }

  // ─── Notificaciones ─────────────────────────────────────────────────────

  @Get('notificaciones/todas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async listarTodasLasNotificaciones(@Query('limite') limite?: string) {
    const cantidad = limite ? parseInt(limite, 10) : 50;
    const notificaciones = await this.alertingService.listarTodas(cantidad);
    return notificaciones.map((n) => n.toJSON());
  }

  @Get('notificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async listarNotificaciones(@Request() req: any) {
    const personaId = req.user?.personaId;
    if (!personaId) {
      return [];
    }
    const notificaciones =
      await this.alertingService.listarPorDestinatario(personaId);
    return notificaciones.map((n) => n.toJSON());
  }

  @Patch('notificaciones/:id/leer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
  async marcarNotificacionLeida(@Param('id') id: string) {
    const notificacion = await this.alertingService.marcarLeida(id);
    return notificacion.toJSON();
  }
}
