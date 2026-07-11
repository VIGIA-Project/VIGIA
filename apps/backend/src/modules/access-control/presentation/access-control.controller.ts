import { Controller, Get, Post, Body, Query, Request, UseGuards, Param, Patch } from '@nestjs/common';
import { AccessControlService } from '../application/access-control.service';
import { RegistrarEventoManualDto, CrearPaseGaritaDto } from '../application/dtos/registrar-evento-manual.dto';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';

@Controller('access-control')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get('eventos/recientes')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async obtenerEventosRecientes(@Query('limite') limite?: string) {
    const lim = limite ? parseInt(limite, 10) : 7;
    return this.accessControlService.obtenerEventosRecientes(lim);
  }

  @Post('eventos/manual')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async registrarEventoManual(@Request() req: any, @Body() dto: RegistrarEventoManualDto) {
    const guardiaId = req.user?.id || 'system';
    return this.accessControlService.registrarEventoManual(dto, guardiaId);
  }

  @Post('pases-garita')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async crearPaseGarita(@Request() req: any, @Body() dto: CrearPaseGaritaDto) {
    const guardiaId = req.user?.id || 'system';
    return this.accessControlService.crearPaseGarita(dto, guardiaId);
  }

  @Get('pases-garita')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async listarPasesGarita() {
    return this.accessControlService.listarPasesGarita();
  }

  @Get('pases-garita/count')
  @Roles(UserRole.ADMIN)
  async contarPasesGaritaActivos() {
    const count = await this.accessControlService.contarPasesGaritaActivos();
    return { count };
  }

  @Patch('pases-garita/:id/finalizar')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async finalizarPaseGarita(@Param('id') id: string) {
    return this.accessControlService.finalizarPaseGarita(id);
  }
}
