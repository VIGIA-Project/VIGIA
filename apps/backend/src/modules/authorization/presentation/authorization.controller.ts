import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { REGISTRY_PORT } from '../../registry/application/ports/registry.port';
import type { IRegistryPort } from '../../registry/application/ports/registry.port';
import { AuthorizationService } from '../application/authorization.service';
import { CrearAutorizacionPermanenteDto } from '../application/dto/crear-autorizacion-permanente.dto';
import { CrearPermisoTemporalDto } from '../application/dto/crear-permiso-temporal.dto';
import { CrearPaseRapidoDto } from '../application/dto/crear-pase-rapido.dto';
import { ValidarPaseDto } from '../application/dto/validar-pase.dto';
import { ConsumirPaseDto } from '../application/dto/consumir-pase.dto';

@Controller('authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
  ) {}

  private propietarioIdDesdeJwt(req: any): string {
    const propietarioId = req.user?.personaId;
    if (!propietarioId) {
      throw new BadRequestException(
        'El usuario autenticado no tiene una persona asociada (personaId ausente en el token)',
      );
    }
    return propietarioId;
  }

  // ─── Autorizaciones permanentes ──────────────────────────────────────

  @Get('permanentes')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async listarTodasPermanentes() {
    return this.authorizationService.listarTodasPermanentes();
  }

  @Get('permanentes/count')
  @Roles(UserRole.ADMIN)
  async contarPermanentesActivas() {
    const total = await this.authorizationService.contarPermanentesActivas();
    return { count: total };
  }

  @Post('permanentes')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async crearAutorizacionPermanente(
    @Request() req: any,
    @Body() dto: CrearAutorizacionPermanenteDto,
  ) {
    return this.authorizationService.crearAutorizacionPermanente(
      dto,
      this.propietarioIdDesdeJwt(req),
    );
  }

  @Get('permanentes/vehiculo/:vehiculoId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarPermanentesPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
    return this.authorizationService.listarPorVehiculo(vehiculoId);
  }

  @Get('permanentes/vehiculo/:vehiculoId/activas')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.GUARD)
  async listarPermanentesActivasPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
    return this.authorizationService.listarActivasPorVehiculo(vehiculoId);
  }

  @Patch('permanentes/:id/revocar')
  @Roles(UserRole.OWNER)
  async revocarAutorizacionPermanente(@Param('id') id: string) {
    return this.authorizationService.revocarAutorizacion(id);
  }

  // ─── Permisos temporales ──────────────────────────────────────────────

  @Get('temporales')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async listarTodosTemporales() {
    return this.authorizationService.listarTodosTemporales();
  }

  @Get('temporales/count')
  @Roles(UserRole.ADMIN)
  async contarTemporalesActivos() {
    const total = await this.authorizationService.contarTemporalesActivos();
    return { count: total };
  }

  @Get('temporales/proximos-expirar')
  @Roles(UserRole.ADMIN)
  async listarTemporalesProximosAExpirar(@Query('dias') dias?: string) {
    const d = dias ? parseInt(dias, 10) : 2;
    return this.authorizationService.obtenerPermisosProximosAExpirar(d);
  }

  @Post('temporales')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async crearPermisoTemporal(@Request() req: any, @Body() dto: CrearPermisoTemporalDto) {
    return this.authorizationService.crearPermisoTemporal(dto, this.propietarioIdDesdeJwt(req));
  }

  @Get('temporales/vehiculo/:vehiculoId')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.GUARD)
  async listarTemporalesVigentesPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
    return this.authorizationService.listarVigentesPorVehiculo(vehiculoId);
  }

  @Get('temporales/persona/:personaId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarTemporalesPorPersona(@Param('personaId') personaId: string) {
    return this.authorizationService.listarPorPersona(personaId);
  }

  @Patch('temporales/:id/revocar')
  @Roles(UserRole.OWNER)
  async revocarPermisoTemporal(@Param('id') id: string) {
    return this.authorizationService.revocarPermiso(id);
  }

  // ─── Pases de acceso rápido ────────────────────────────────────────────

  @Post('pases')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async generarPase(@Request() req: any, @Body() dto: CrearPaseRapidoDto) {
    return this.authorizationService.generarPase(dto, this.propietarioIdDesdeJwt(req));
  }

  @Get('pases/mis-pases')
  @Roles(UserRole.OWNER)
  async misPases(@Request() req: any) {
    return this.authorizationService.listarPorPropietario(this.propietarioIdDesdeJwt(req));
  }

  @Get('pases/placa/:placa')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async listarPasesActivosPorPlaca(@Param('placa') placa: string) {
    return this.authorizationService.listarActivosPorPlaca(placa);
  }

  @Post('pases/validar')
  @Roles(UserRole.GUARD)
  @HttpCode(HttpStatus.OK)
  async validarPase(@Body() dto: ValidarPaseDto) {
    return this.authorizationService.validarPase(dto.codigo, dto.placa);
  }

  @Patch('pases/:id/revocar')
  @Roles(UserRole.OWNER)
  async revocarPase(@Param('id') id: string) {
    return this.authorizationService.revocarPase(id);
  }

  @Patch('pases/:id/consumir')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async consumirPase(@Param('id') id: string, @Body() dto: ConsumirPaseDto) {
    return this.authorizationService.consumirPase(id, dto.eventoId);
  }

  // ─── Conjunto autorizado ────────────────────────────────────────────────

  @Get('conjunto-autorizado/vehiculo/:vehiculoId')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async obtenerConjuntoAutorizado(@Param('vehiculoId') vehiculoId: string) {
    const vehiculo = await this.registryPort.findVehiculoById(vehiculoId);
    if (!vehiculo) {
      throw new BadRequestException(`Vehículo '${vehiculoId}' no encontrado`);
    }
    return this.authorizationService.obtenerConjuntoAutorizado(
      vehiculoId,
      vehiculo.propietarioPersonaId,
    );
  }
}
