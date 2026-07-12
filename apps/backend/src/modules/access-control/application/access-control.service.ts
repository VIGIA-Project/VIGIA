import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVENTO_ACCESO_REPOSITORY } from '@shared/constants/injection-tokens';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { OrigenResolucion } from '../domain/value-objects/origen-resolucion.vo';
import { RegistrarEventoManualDto } from './dtos/registrar-evento-manual.dto';
import { InvitadoActivoDto } from './dtos/invitado-activo.dto';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Access Control.
 * La resolución automática (OCR + biometría) todavía no está conectada;
 * por ahora solo se soporta el registro manual que hace el guardia en garita.
 */
@Injectable()
export class AccessControlService {
  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
  ) {}

  async registrarEventoManual(dto: RegistrarEventoManualDto): Promise<EventoAcceso> {
    const ahora = new Date();
    const evento = EventoAcceso.crear({
      id: uuidv4(),
      vehiculoId: dto.vehiculoId,
      personaDetectadaId: dto.personaId,
      placaObservada: dto.placaObservada,
      tipoMovimiento: dto.tipoMovimiento,
      decisionOperativa: dto.decisionOperativa,
      motivoCodigo: dto.motivoCodigo,
      motivoDetalle: dto.motivoDetalle,
      origenResolucion: OrigenResolucion.MANUAL,
      capturadoEn: ahora,
      resueltoEn: ahora,
      duracionAutorizadaMin: dto.duracionAutorizadaMin,
    });
    return this.eventoAccesoRepository.guardar(evento);
  }

  async listarRecientes(limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async contarHoy(): Promise<number> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return this.eventoAccesoRepository.contarPorRangoFecha(inicioDia, finDia);
  }

  async obtenerMetricasHoy(): Promise<{ exitosos: number; pendientes: number; denegados: number }> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);

    const [exitosos, pendientes, denegados] = await Promise.all([
      this.eventoAccesoRepository.contarPorRangoYDecision(inicioDia, finDia, 'SUCCESSFUL'),
      this.eventoAccesoRepository.contarPorRangoYDecision(inicioDia, finDia, 'PENDING_VERIFY'),
      this.eventoAccesoRepository.contarPorRangoYDecision(inicioDia, finDia, 'DENIED'),
    ]);

    return { exitosos, pendientes, denegados };
  }

  async listarInvitadosActivos(): Promise<InvitadoActivoDto[]> {
    const eventos = await this.eventoAccesoRepository.buscarInvitadosActivos();
    return eventos.map((evento) => this.aInvitadoActivoDto(evento));
  }

  async contarInvitadosActivos(): Promise<number> {
    const invitados = await this.listarInvitadosActivos();
    return invitados.length;
  }

  private aInvitadoActivoDto(evento: EventoAcceso): InvitadoActivoDto {
    const duracion = evento.duracionAutorizadaMin ?? null;
    const estaExcedido =
      duracion != null && Date.now() - evento.capturadoEn.getTime() > duracion * 60000;
    return {
      eventoId: evento.id,
      placaObservada: evento.placaObservada,
      motivoDetalle: evento.motivoDetalle ?? '',
      capturadoEn: evento.capturadoEn,
      duracionAutorizadaMin: duracion,
      estaExcedido,
    };
  }
}
