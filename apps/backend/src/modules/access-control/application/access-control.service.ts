import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVENTO_ACCESO_REPOSITORY } from '@shared/constants/injection-tokens';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { OrigenResolucion } from '../domain/value-objects/origen-resolucion.vo';
import { DecisionOperativa } from '../domain/value-objects/decision-operativa.vo';
import { RegistrarEventoManualDto } from './dtos/registrar-evento-manual.dto';
import { InvitadoActivoDto } from './dtos/invitado-activo.dto';
import { AlertingService } from '../../alerting/application/alerting.service';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Access Control.
 * La resolución automática (OCR + biometría) todavía no está conectada;
 * por ahora solo se soporta el registro manual que hace el guardia en garita.
 */
@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
    private readonly alertingService: AlertingService,
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
    const guardado = await this.eventoAccesoRepository.guardar(evento);

    if (guardado.decisionOperativa === DecisionOperativa.DENIED) {
      this.alertingService
        .crearAlertaDesdeEventoDenegado({
          eventoId: guardado.id,
          vehiculoId: guardado.vehiculoId,
          placa: guardado.placaObservada,
          motivoCodigo: guardado.motivoCodigo,
        })
        .catch((err) => this.logger.warn(`No se pudo generar alerta de acceso denegado: ${err?.message}`));
    }

    return guardado;
  }

  async listarRecientes(limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async listarPorVehiculo(vehiculoId: string, limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarPorVehiculo(vehiculoId, limite);
  }

  async buscarPorId(id: string): Promise<EventoAcceso> {
    const evento = await this.eventoAccesoRepository.buscarPorId(id);
    if (!evento) {
      throw new NotFoundException(`Evento de acceso '${id}' no encontrado`);
    }
    return evento;
  }

  async contarHoy(): Promise<number> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return this.eventoAccesoRepository.contarPorRangoFecha(inicioDia, finDia);
  }

  async contarHoyPorTipo(): Promise<{ entradas: number; salidas: number }> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    const [entradas, salidas] = await Promise.all([
      this.eventoAccesoRepository.contarPorRangoFechaYTipo(inicioDia, finDia, 'ENTRADA'),
      this.eventoAccesoRepository.contarPorRangoFechaYTipo(inicioDia, finDia, 'SALIDA'),
    ]);
    return { entradas, salidas };
  }

  async listarInvitadosActivos(): Promise<InvitadoActivoDto[]> {
    const eventos = await this.eventoAccesoRepository.buscarInvitadosActivos();
    const invitados = eventos.map((evento) => this.aInvitadoActivoDto(evento));

    invitados
      .filter((i) => i.estaExcedido)
      .forEach((invitado) => {
        this.alertingService
          .crearAlertaInvitadoExcedido({
            eventoId: invitado.eventoId,
            vehiculoId: eventos.find((e) => e.id === invitado.eventoId)?.vehiculoId,
            placa: invitado.placaObservada,
            duracionAutorizadaMin: invitado.duracionAutorizadaMin ?? 0,
          })
          .catch((err) => this.logger.warn(`No se pudo generar alerta de invitado excedido: ${err?.message}`));
      });

    return invitados;
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
