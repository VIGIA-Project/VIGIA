// presentation/access-control.controller.ts
import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/presentation/roles.guard';
import { Roles } from '../../../core/auth/presentation/roles.decorator';
import { UserRole } from '../../../core/auth/domain/user.entity';
import {
  CrearEventoAccesoUseCase,
  ListarEventosPendientesUseCase,
  ObtenerEventoUseCase,
  ResolverEventoManualUseCase,
  RegistrarContingenciaUseCase,
  ObtenerHistorialPlacaUseCase,
} from '../application/use-cases/access-control.use-cases';
import {
  CrearEventoDto,
  ResolverEventoDto,
  RegistrarContingenciaDto,
  RegistrarInvitadoDto,
} from '../application/dtos/access-control.dtos';

@Controller('eventos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessControlController {
  constructor(
    private readonly crearEvento: CrearEventoAccesoUseCase,
    private readonly listarPendientes: ListarEventosPendientesUseCase,
    private readonly obtenerEvento: ObtenerEventoUseCase,
    private readonly resolverEvento: ResolverEventoManualUseCase,
    private readonly registrarContingencia: RegistrarContingenciaUseCase,
    private readonly historialPlaca: ObtenerHistorialPlacaUseCase,
  ) {}

  // ── GET /eventos — lista eventos (con filtro opcional estado/placa) ────────
  @Get()
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async listar(
    @Query('estado') estado?: string,
    @Query('puntoControlId') puntoControlId?: string,
    @Query('placa') placa?: string,
    @Query('limit') limit?: number,
  ) {
    if (placa) {
      return this.historialPlaca.execute(placa, limit);
    }
    if (estado === 'PENDING_VERIFY') {
      return this.listarPendientes.execute(puntoControlId);
    }
    return this.listarPendientes.execute(puntoControlId);
  }

  // ── GET /eventos/:id ──────────────────────────────────────────────────────
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async obtener(@Param('id') id: string) {
    return this.obtenerEvento.execute(id);
  }

  // ── POST /eventos — crear evento (OCR/sistema) ────────────────────────────
  @Post()
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearEventoDto) {
    return this.crearEvento.execute(dto);
  }

  // ── PATCH /eventos/:id/resolver — resolución manual del guardia ───────────
  @Patch(':id/resolver')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  async resolver(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ResolverEventoDto,
  ) {
    return this.resolverEvento.execute(id, req.user.id, dto);
  }

  // ── POST /eventos/:id/contingencia ────────────────────────────────────────
  @Post(':id/contingencia')
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async contingencia(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: RegistrarContingenciaDto,
  ) {
    return this.registrarContingencia.execute(id, req.user.id, dto);
  }
}

// ── INVITADOS CONTROLLER ──────────────────────────────────────────────────────
@Controller('invitados')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitadosController {
  // TODO: Inyectar RegistrarInvitadoUseCase cuando esté implementado
  @Post()
  @Roles(UserRole.GUARD, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async registrar(@Body() dto: RegistrarInvitadoDto, @Request() req: any) {
    // TODO: implementar use case RegistrarInvitadoUseCase
    return { message: 'Invitado registrado (pendiente implementación completa)', dto };
  }
}
