import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AccessControlService } from '../application/access-control.service';
import { RegistrarEventoManualDto } from '../application/dtos/registrar-evento-manual.dto';

@Controller('access-control')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get('eventos/recientes')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async listarEventosRecientes(@Query('limite') limite?: string) {
    const cantidad = limite ? parseInt(limite, 10) : 10;
    const eventos = await this.accessControlService.listarRecientes(cantidad);
    return eventos.map((e) => e.toJSON());
  }

  @Post('eventos/manual')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async registrarEventoManual(@Body() dto: RegistrarEventoManualDto) {
    const evento = await this.accessControlService.registrarEventoManual(dto);
    return evento.toJSON();
  }

  @Get('eventos/count')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async contarEventosHoy() {
    const count = await this.accessControlService.contarHoy();
    return { count };
  }
}
