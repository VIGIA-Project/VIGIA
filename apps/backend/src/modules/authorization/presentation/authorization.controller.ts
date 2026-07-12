import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { REGISTRY_PORT } from '../../registry/application/ports/registry.port';
import type { IRegistryPort } from '../../registry/application/ports/registry.port';
import { AuthorizationService } from '../application/authorization.service';
import {
  CrearMiembroGrupoFamiliarDto,
  CrearAutorizacionPermanenteLegacyDto,
} from '../application/dto/crear-miembro-grupo-familiar.dto';
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

  // ─── Grupo familiar ─────────────────────────────────────────────────

  @Post('grupo-familiar')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async crearMiembroGrupoFamiliar(
    @Request() req: any,
    @Body() dto: CrearMiembroGrupoFamiliarDto,
  ) {
    return this.authorizationService.crearMiembroGrupoFamiliar(
      dto,
      this.propietarioIdDesdeJwt(req),
    );
  }

  @Get('grupo-familiar')
  @Roles(UserRole.ADMIN)
  async listarTodosGrupoFamiliar() {
    const todos = await this.authorizationService.listarTodosGrupoFamiliar();
    return todos.map(m => m.toJSON ? m.toJSON() : m);
  }

  @Get('grupo-familiar/propietario/:propietarioId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarGrupoFamiliarPorPropietario(@Param('propietarioId') propietarioId: string) {
    return this.authorizationService.listarGrupoFamiliarPorPropietario(propietarioId);
  }

  @Get('grupo-familiar/propietario/:propietarioId/activos')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.GUARD)
  async listarGrupoFamiliarActivoPorPropietario(@Param('propietarioId') propietarioId: string) {
    return this.authorizationService.listarGrupoFamiliarActivoPorPropietario(propietarioId);
  }

  @Patch('grupo-familiar/:id/revocar')
  @Roles(UserRole.OWNER)
  async revocarMiembroGrupoFamiliar(@Param('id') id: string) {
    return this.authorizationService.revocarMiembroGrupoFamiliar(id);
  }

  @Get('grupo-familiar/count')
  @Roles(UserRole.ADMIN)
  async contarMiembrosGrupoFamiliar() {
    const count = await this.authorizationService.contarMiembrosActivos();
    return { count };
  }

  // ─── Autorizaciones permanentes (legacy aliases) ───────────────────────
  // TODO: eliminar alias legacy después de actualizar frontend
  // El grupo familiar ahora se vincula al propietario, no a un vehículo.
  // Estos endpoints se mantienen temporalmente resolviendo el propietario
  // dueño del vehículo recibido, para no romper al frontend actual.

  @Post('permanentes')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async crearAutorizacionPermanenteLegacy(
    @Request() req: any,
    @Body() dto: CrearAutorizacionPermanenteLegacyDto,
  ) {
    return this.authorizationService.crearMiembroGrupoFamiliar(
      dto,
      this.propietarioIdDesdeJwt(req),
    );
  }

  @Get('permanentes/vehiculo/:vehiculoId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarPermanentesPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
    const propietarioId = await this.propietarioIdDesdeVehiculo(vehiculoId);
    return this.authorizationService.listarGrupoFamiliarPorPropietario(propietarioId);
  }

  @Get('permanentes/vehiculo/:vehiculoId/activas')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.GUARD)
  async listarPermanentesActivasPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
    const propietarioId = await this.propietarioIdDesdeVehiculo(vehiculoId);
    return this.authorizationService.listarGrupoFamiliarActivoPorPropietario(propietarioId);
  }

  @Patch('permanentes/:id/revocar')
  @Roles(UserRole.OWNER)
  async revocarAutorizacionPermanenteLegacy(@Param('id') id: string) {
    return this.authorizationService.revocarMiembroGrupoFamiliar(id);
  }

  private async propietarioIdDesdeVehiculo(vehiculoId: string): Promise<string> {
    const vehiculo = await this.registryPort.findVehiculoById(vehiculoId);
    if (!vehiculo) {
      throw new BadRequestException(`Vehículo '${vehiculoId}' no encontrado`);
    }
    return vehiculo.propietarioPersonaId;
  }

  // ─── Permisos temporales ──────────────────────────────────────────────

  @Post('temporales')
  @Roles(UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async crearPermisoTemporal(@Request() req: any, @Body() dto: CrearPermisoTemporalDto) {
    return this.authorizationService.crearPermisoTemporal(dto, this.propietarioIdDesdeJwt(req));
  }

  @Get('temporales/propietario/:propietarioId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarTemporalesPorPropietario(@Param('propietarioId') propietarioId: string) {
    const temporales = await this.authorizationService.listarTemporalesPorPropietario(propietarioId);
    return temporales.map((t) => t.toJSON ? t.toJSON() : t);
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

  @Get('temporales/count')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async contarPermisosTemporales() {
    const count = await this.authorizationService.contarPermisosVigentes();
    return { count };
  }

  @Get('temporales/proximos-expirar')
  @Roles(UserRole.ADMIN)
  async listarProximosAExpirar(@Query('dias') dias?: string) {
    const diasVentana = dias ? parseInt(dias, 10) : 7;
    return this.authorizationService.listarProximosAExpirar(diasVentana);
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
    const pases = await this.authorizationService.listarPorPropietario(this.propietarioIdDesdeJwt(req));
    return pases.map((p) => p.toJSON ? p.toJSON() : p);
  }

  @Get('pases/propietario/:propietarioId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listarPasesPorPropietario(@Param('propietarioId') propietarioId: string) {
    const pases = await this.authorizationService.listarPorPropietario(propietarioId);
    return pases.map((p) => p.toJSON ? p.toJSON() : p);
  }

  @Get('pases/placa/:placa')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async listarPasesActivosPorPlaca(@Param('placa') placa: string) {
    return this.authorizationService.listarActivosPorPlaca(placa);
  }

  @Post('pases/validar')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async validarPase(@Body() dto: ValidarPaseDto) {
    return this.authorizationService.validarYConsumirPase(dto.codigo, dto.placa);
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

  @Get('pases/count')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async contarPases() {
    const count = await this.authorizationService.contarPasesActivos();
    return { count };
  }

  // ─── Conjunto autorizado ────────────────────────────────────────────────

  @Get('conjunto-autorizado/vehiculo/:vehiculoId')
  @Roles(UserRole.GUARD, UserRole.ADMIN, UserRole.OWNER)
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
