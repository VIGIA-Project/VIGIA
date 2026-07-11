import { Controller, Get, Patch, Param, Query, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from '../application/notification.service';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async obtenerNotificaciones(@Request() req: any) {
    const userRole = req.user?.role;
    const personaId = req.user?.personaId;
    return this.notificationService.obtenerPorRolYPersona(userRole, personaId, 20);
  }

  @Get('count')
  async contarNoLeidas(@Request() req: any) {
    const userRole = req.user?.role;
    const personaId = req.user?.personaId;
    const count = await this.notificationService.contarNoLeidas(userRole, personaId);
    return { count };
  }

  @Patch(':id/leer')
  async marcarLeida(@Param('id') id: string) {
    return this.notificationService.marcarComoLeida(id);
  }
}
