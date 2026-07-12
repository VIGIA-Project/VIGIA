import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@core/exceptions/domain-exception';
import { ALERTA_REPOSITORY, NOTIFICACION_REPOSITORY } from '@shared/constants/injection-tokens';
import { IAlertaRepository } from '../domain/repositories/alerta.repository';
import { INotificacionRepository } from '../domain/repositories/notificacion.repository';
import { Alerta } from '../domain/entities/alerta.entity';
import { Notificacion } from '../domain/entities/notificacion.entity';

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

  async contarNoResueltas(): Promise<number> {
    return this.alertaRepository.contarNoResueltas();
  }

  async marcarAlertaAtendida(id: string): Promise<Alerta> {
    const alerta = await this.alertaRepository.buscarPorId(id);
    if (!alerta) {
      throw new EntityNotFoundException('Alerta', id);
    }
    alerta.marcarAtendida();
    return this.alertaRepository.guardar(alerta);
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
