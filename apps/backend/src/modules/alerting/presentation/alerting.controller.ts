import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AlertingService, CreateAlertDto, ResolveAlertDto } from '../application/alerting.service';

@Controller('alerting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlertingController {
  constructor(private readonly alertingService: AlertingService) {}

  @Post('alerts')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async createAlert(@Body() dto: CreateAlertDto) {
    return this.alertingService.createAlert(dto);
  }

  @Get('alerts/active')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async getActiveAlerts() {
    return this.alertingService.getActiveAlerts();
  }

  @Patch('alerts/:id/resolve')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async resolveAlert(@Request() req, @Param('id') id: string, @Body() dto: ResolveAlertDto) {
    return this.alertingService.resolveAlert(id, req.user.id, dto);
  }
}
