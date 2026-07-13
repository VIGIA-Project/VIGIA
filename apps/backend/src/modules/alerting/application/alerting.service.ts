import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EntityNotFoundException } from '@core/exceptions/domain-exception';
import { ALERTA_REPOSITORY, NOTIFICACION_REPOSITORY } from '@shared/constants/injection-tokens';
import { IAlertaRepository } from '../domain/repositories/alerta.repository';
import { INotificacionRepository } from '../domain/repositories/notificacion.repository';
import { Alerta } from '../domain/entities/alerta.entity';
import { Notificacion } from '../domain/entities/notificacion.entity';
import { SeveridadAlerta } from '../domain/value-objects/severidad-alerta.vo';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Alerting.
 * Alertas y Notificaciones son un único Bounded Context: las notificaciones
 * son el envío de una alerta a un destinatario por un canal concreto.
 */
@Injectable()
export class AlertingService {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: IAlertaRepository,
    @Inject(NOTIFICACION_REPOSITORY)
    private readonly notificacionRepository: INotificacionRepository,
  ) {}

  // ─── Alertas ────────────────────────────────────────────────────────────

  async listarRecientes(limite: number): Promise<Alerta[]> {
    return this.alertaRepository.buscarRecientes(limite);
  }

  async buscarPorId(id: string): Promise<Alerta> {
    const alerta = await this.alertaRepository.buscarPorId(id);
    if (!alerta) {
      throw new EntityNotFoundException('Alerta', id);
    }
    return alerta;
  }

  async contarNoResueltas(): Promise<number> {
    return this.alertaRepository.contarNoResueltas();
  }

  async marcarAtendida(id: string): Promise<Alerta> {
    const alerta = await this.alertaRepository.buscarPorId(id);
    if (!alerta) {
      throw new EntityNotFoundException('Alerta', id);
    }
    alerta.marcarAtendida();
    return this.alertaRepository.guardar(alerta);
  }

  /** Crea una alerta solo si no existe ya una pendiente para la misma causa+referencia. */
  async crearAlertaIdempotente(props: {
    causaOrigen: string;
    referenciaOrigenId: string;
    vehiculoId?: string;
    severidad: SeveridadAlerta;
    mensajeResumen: string;
  }): Promise<Alerta> {
    const existente = await this.alertaRepository.buscarPendientePorCausaYReferencia(
      props.causaOrigen,
      props.referenciaOrigenId,
    );
    if (existente) return existente;

    const alerta = Alerta.crear({
      id: uuidv4(),
      causaOrigen: props.causaOrigen,
      referenciaOrigenId: props.referenciaOrigenId,
      vehiculoId: props.vehiculoId,
      severidad: props.severidad,
      mensajeResumen: props.mensajeResumen,
    });
    return this.alertaRepository.guardar(alerta);
  }

  async crearAlertaDesdeEventoDenegado(props: {
    eventoId: string;
    vehiculoId?: string;
    placa: string;
    motivoCodigo: string;
  }): Promise<Alerta> {
    return this.crearAlertaIdempotente({
      causaOrigen: 'ACCESO_DENEGADO',
      referenciaOrigenId: props.eventoId,
      vehiculoId: props.vehiculoId,
      severidad: SeveridadAlerta.ALTA,
      mensajeResumen: `Acceso denegado para placa ${props.placa}: ${props.motivoCodigo}`,
    });
  }

  async crearAlertaInvitadoExcedido(props: {
    eventoId: string;
    vehiculoId?: string;
    placa: string;
    duracionAutorizadaMin: number;
  }): Promise<Alerta> {
    return this.crearAlertaIdempotente({
      causaOrigen: 'INVITADO_EXCEDIO_TIEMPO',
      referenciaOrigenId: props.eventoId,
      vehiculoId: props.vehiculoId,
      severidad: SeveridadAlerta.MEDIA,
      mensajeResumen: `Invitado con placa ${props.placa} excedió el tiempo autorizado (${props.duracionAutorizadaMin} min)`,
    });
  }

  // ─── Notificaciones ─────────────────────────────────────────────────────

  async listarPorDestinatario(destinatarioPersonaId: string): Promise<Notificacion[]> {
    return this.notificacionRepository.buscarPorDestinatario(destinatarioPersonaId);
  }

  async listarTodas(limite: number): Promise<Notificacion[]> {
    return this.notificacionRepository.buscarTodas(limite);
  }

  async marcarLeida(id: string): Promise<Notificacion> {
    const notificacion = await this.notificacionRepository.buscarPorId(id);
    if (!notificacion) {
      throw new EntityNotFoundException('Notificacion', id);
    }
    notificacion.marcarLeida();
    return this.notificacionRepository.guardar(notificacion);
  }
}
