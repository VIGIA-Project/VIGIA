import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { REGISTRY_PORT } from '../../registry/application/ports/registry.port';
import type { IRegistryPort } from '../../registry/application/ports/registry.port';
import { AccessControlService } from '../application/access-control.service';
import { RegistrarEventoManualDto } from '../application/dtos/registrar-evento-manual.dto';
import { InvitadoActivoDto } from '../application/dtos/invitado-activo.dto';

@Controller('access-control')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessControlController {
  constructor(
    private readonly accessControlService: AccessControlService,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
  ) {}

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

  @Get('eventos/count-por-tipo')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async contarEventosHoyPorTipo() {
    return this.accessControlService.contarHoyPorTipo();
  }

  @Get('eventos/:id')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async buscarEventoPorId(@Param('id') id: string) {
    const evento = await this.accessControlService.buscarPorId(id);
    return evento.toJSON();
  }

  @Get('eventos/vehiculo/:vehiculoId')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.GUARD)
  async listarEventosPorVehiculo(
    @Request() req: any,
    @Param('vehiculoId') vehiculoId: string,
    @Query('limite') limite?: string,
  ) {
    if (req.user?.role === UserRole.OWNER) {
      const vehiculo = await this.registryPort.findVehiculoById(vehiculoId);
      if (!vehiculo) {
        throw new BadRequestException(`Vehículo '${vehiculoId}' no encontrado`);
      }
      if (vehiculo.propietarioPersonaId !== req.user?.personaId) {
        throw new ForbiddenException('No puede consultar eventos de un vehículo ajeno');
      }
    }
    const cantidad = limite ? parseInt(limite, 10) : 20;
    const eventos = await this.accessControlService.listarPorVehiculo(vehiculoId, cantidad);
    return eventos.map((e) => e.toJSON());
  }

  @Get('invitados-activos')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async listarInvitadosActivos(): Promise<InvitadoActivoDto[]> {
    return this.accessControlService.listarInvitadosActivos();
  }

  @Get('invitados-activos/count')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async contarInvitadosActivos(): Promise<{ count: number }> {
    const count = await this.accessControlService.contarInvitadosActivos();
    return { count };
  }
}
