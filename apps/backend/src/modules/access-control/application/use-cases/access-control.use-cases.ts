// application/use-cases/access-control.use-cases.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IAccessEventRepository, ACCESS_EVENT_REPOSITORY,
} from '../../domain/repositories/access-event.repository';
import {
  EventoAcceso, TipoMovimiento, DecisionOperativa,
  OrigenResolucion, CausaContingencia, MotivoInvitado,
} from '../../domain/entities/access-event.entity';
import {
  CrearEventoDto, ResolverEventoDto,
  RegistrarContingenciaDto, RegistrarInvitadoDto,
} from '../dtos/access-control.dtos';
import { EventoAccesoOrmEntity } from '../../infrastructure/repositories/access-event.orm-entity';

// ── USE CASE 1: Crear evento ──────────────────────────────────────────────────
@Injectable()
export class CrearEventoAccesoUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(dto: CrearEventoDto): Promise<EventoAcceso> {
    const evento = EventoAcceso.crear({
      placaObservada:    dto.placaObservada.toUpperCase(),
      tipoMovimiento:    dto.tipoMovimiento,
      vehiculoId:        dto.vehiculoId,
      personaDetectadaId: dto.personaDetectadaId,
      puntoControlId:    dto.puntoControlId,
      carril:            dto.carril,
      scoreBiometrico:   dto.scoreBiometrico,
      motivoCodigo:      dto.motivoCodigo,
      evidenciaResumen:  dto.evidenciaResumen,
    });
    return this.repo.save(evento);
  }
}

// ── USE CASE 2: Listar pendientes ─────────────────────────────────────────────
@Injectable()
export class ListarEventosPendientesUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(puntoControlId?: string): Promise<EventoAcceso[]> {
    return this.repo.findPendientes(puntoControlId);
  }
}

// ── USE CASE 3: Obtener evento por ID ─────────────────────────────────────────
@Injectable()
export class ObtenerEventoUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(id: string): Promise<EventoAcceso> {
    const evento = await this.repo.findById(id);
    if (!evento) throw new NotFoundException(`Evento ${id} no encontrado`);
    return evento;
  }
}

// ── USE CASE 4: Resolver evento manualmente ───────────────────────────────────
@Injectable()
export class ResolverEventoManualUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(eventoId: string, actorId: string, dto: ResolverEventoDto): Promise<EventoAcceso> {
    const evento = await this.repo.findById(eventoId);
    if (!evento) throw new NotFoundException(`Evento ${eventoId} no encontrado`);
    if (evento.decisionOperativa !== DecisionOperativa.PENDING_VERIFY) {
      throw new BadRequestException('El evento ya fue resuelto');
    }

    const decision = dto.decision === 'SUCCESSFUL'
      ? DecisionOperativa.SUCCESSFUL
      : DecisionOperativa.DENIED;

    evento.resolver(decision, dto.motivo, OrigenResolucion.MANUAL);
    return this.repo.update(evento);
  }
}

// ── USE CASE 5: Registrar contingencia ───────────────────────────────────────
@Injectable()
export class RegistrarContingenciaUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(eventoId: string, actorId: string, dto: RegistrarContingenciaDto): Promise<EventoAcceso> {
    const evento = await this.repo.findById(eventoId);
    if (!evento) throw new NotFoundException(`Evento ${eventoId} no encontrado`);
    if (evento.decisionOperativa !== DecisionOperativa.PENDING_VERIFY) {
      throw new BadRequestException('El evento ya fue resuelto');
    }

    const decision = dto.decisionTomada === 'SUCCESSFUL'
      ? DecisionOperativa.SUCCESSFUL
      : DecisionOperativa.DENIED;

    evento.resolver(
      decision,
      `[CONTINGENCIA: ${dto.causaContingencia}] ${dto.detalleContingencia}`,
      OrigenResolucion.CONTINGENCIA,
    );
    return this.repo.update(evento);
  }
}

// ── USE CASE 6: Historial por placa ──────────────────────────────────────────
@Injectable()
export class ObtenerHistorialPlacaUseCase {
  constructor(
    @Inject(ACCESS_EVENT_REPOSITORY)
    private readonly repo: IAccessEventRepository,
  ) {}

  async execute(placa: string, limit = 20): Promise<EventoAcceso[]> {
    return this.repo.findByPlaca(placa.toUpperCase(), limit);
  }
}
