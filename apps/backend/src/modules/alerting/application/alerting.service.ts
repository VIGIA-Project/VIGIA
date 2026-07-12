import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EntityNotFoundException } from '@core/exceptions/domain-exception';
import { ALERTA_REPOSITORY, NOTIFICACION_REPOSITORY } from '@shared/constants/injection-tokens';
import { IAlertaRepository } from '../domain/repositories/alerta.repository';
import { INotificacionRepository } from '../domain/repositories/notificacion.repository';
import { Alerta } from '../domain/entities/alerta.entity';
import { SeveridadAlerta } from '../domain/value-objects/severidad-alerta.vo';
import { Notificacion } from '../domain/entities/notificacion.entity';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Alerting.
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

  /**
   * Crea una alerta idempotente: si ya existe una alerta no-ATENDIDA con la
   * misma causa y referencia, no duplica y retorna la existente.
   */
  async crearAlertaIdempotente(data: {
    causaOrigen: string;
    referenciaOrigenId: string;
    severidad: SeveridadAlerta;
    mensajeResumen: string;
    vehiculoId?: string;
  }): Promise<Alerta> {
    const existente = await this.alertaRepository.buscarPendientePorCausaYReferencia(
      data.causaOrigen,
      data.referenciaOrigenId,
    );
    if (existente) return existente;

    const alerta = Alerta.crear({
      id: uuidv4(),
      causaOrigen: data.causaOrigen,
      referenciaOrigenId: data.referenciaOrigenId,
      severidad: data.severidad,
      mensajeResumen: data.mensajeResumen,
      vehiculoId: data.vehiculoId,
      generadaEn: new Date(),
    });
    return this.alertaRepository.guardar(alerta);
  }

  async crearAlertaDesdeEventoDenegado(data: {
    eventoId: string;
    placaObservada: string;
    motivoCodigo: string;
    vehiculoId?: string;
  }): Promise<void> {
    await this.crearAlertaIdempotente({
      causaOrigen: 'ACCESO_DENEGADO',
      referenciaOrigenId: data.eventoId,
      severidad: SeveridadAlerta.ALTA,
      mensajeResumen: `Acceso denegado para placa ${data.placaObservada}: ${data.motivoCodigo}`,
      vehiculoId: data.vehiculoId,
    });
  }

  async crearAlertaPermisoPorExpirar(data: {
    permisoId: string;
    placaVehiculo?: string;
    diasRestantes: number;
  }): Promise<void> {
    await this.crearAlertaIdempotente({
      causaOrigen: 'PERMISO_POR_EXPIRAR',
      referenciaOrigenId: data.permisoId,
      severidad: SeveridadAlerta.MEDIA,
      mensajeResumen: `Permiso temporal próximo a expirar en ${data.diasRestantes} día(s)${data.placaVehiculo ? ` — placa ${data.placaVehiculo}` : ''}`,
    });
  }

  async crearAlertaInvitadoExcedido(data: {
    eventoEntradaId: string;
    placaObservada: string;
    minutosExcedido: number;
  }): Promise<void> {
    await this.crearAlertaIdempotente({
      causaOrigen: 'INVITADO_EXCEDIO_TIEMPO',
      referenciaOrigenId: data.eventoEntradaId,
      severidad: SeveridadAlerta.MEDIA,
      mensajeResumen: `Invitado con placa ${data.placaObservada} excedió el tiempo autorizado por ${data.minutosExcedido} minuto(s)`,
    });
  }

  async crearAlertaAutomatica(data: {
    titulo: string;
    mensaje: string;
    severidad: string;
    origenModulo: string;
    origenEntidadId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Alerta> {
    return this.crearAlertaIdempotente({
      causaOrigen: data.titulo,
      referenciaOrigenId: data.origenEntidadId ?? 'SYSTEM',
      severidad: data.severidad as SeveridadAlerta,
      mensajeResumen: data.mensaje,
    });
  }

  async listarRecientes(limite: number): Promise<Alerta[]> {
    return this.alertaRepository.buscarRecientes(limite);
  }

  async contarNoResueltas(): Promise<number> {
    return this.alertaRepository.contarNoResueltas();
  }

  // ─── Notificaciones ─────────────────────────────────────────────────────

  async listarPorDestinatario(destinatarioPersonaId: string): Promise<Notificacion[]> {
    return this.notificacionRepository.buscarPorDestinatario(destinatarioPersonaId);
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
