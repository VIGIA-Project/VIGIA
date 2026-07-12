import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { CanalNotificacion, EstadoEntregaNotificacion } from '../value-objects/canal-notificacion.vo';

/**
 * Aggregate Root — Notificacion.
 * Representa el envío de una Alerta a un destinatario por un canal concreto.
 */
export class Notificacion {
  private constructor(
    public readonly id: string,
    public readonly alertaId: string,
    public readonly destinatarioPersonaId: string,
    public readonly canal: CanalNotificacion,
    public readonly titulo: string,
    private _estadoEntrega: EstadoEntregaNotificacion,
    public readonly contenidoResumen: string,
    private _leida: boolean,
    private _leidaEn: Date | undefined,
    public readonly enviadaEn: Date | undefined,
  ) {}

  static crear(props: {
    id: string;
    alertaId: string;
    destinatarioPersonaId: string;
    canal: CanalNotificacion;
    titulo: string;
    contenidoResumen: string;
    estadoEntrega?: EstadoEntregaNotificacion;
    leida?: boolean;
    leidaEn?: Date;
    enviadaEn?: Date;
  }): Notificacion {
    return new Notificacion(
      props.id,
      props.alertaId,
      props.destinatarioPersonaId,
      props.canal,
      props.titulo,
      props.estadoEntrega ?? EstadoEntregaNotificacion.PENDIENTE,
      props.contenidoResumen,
      props.leida ?? false,
      props.leidaEn,
      props.enviadaEn,
    );
  }

  get estadoEntrega(): EstadoEntregaNotificacion {
    return this._estadoEntrega;
  }

  get leida(): boolean {
    return this._leida;
  }

  get leidaEn(): Date | undefined {
    return this._leidaEn;
  }

  marcarLeida(): void {
    if (this._leida) {
      throw new BusinessRuleViolationException(
        'Notificacion.marcarLeida',
        'La notificación ya fue marcada como leída',
      );
    }
    this._leida = true;
    this._leidaEn = new Date();
  }

  toJSON() {
    return {
      notificacionId: this.id,
      alertaId: this.alertaId,
      destinatarioPersonaId: this.destinatarioPersonaId,
      canal: this.canal,
      titulo: this.titulo,
      estadoEntrega: this.estadoEntrega,
      contenidoResumen: this.contenidoResumen,
      leida: this.leida,
      leidaEn: this.leidaEn,
      enviadaEn: this.enviadaEn,
    };
  }
}
