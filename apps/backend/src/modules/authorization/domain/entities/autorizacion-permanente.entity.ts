import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { EstadoAutorizacion, esTransicionValida } from '../value-objects/estado-autorizacion.vo';
import { TipoAutorizacion } from '../value-objects/tipo-autorizacion.vo';

/**
 * Aggregate Root — Autorización Permanente.
 * Invariante: exactamente una persona ↔ un vehículo, nunca redefinible como temporal.
 */
export class AutorizacionPermanente {
  private constructor(
    public readonly id: string,
    public readonly personaId: string,
    public readonly vehiculoId: string,
    public readonly propietarioId: string,
    public readonly tipo: TipoAutorizacion,
    private _estado: EstadoAutorizacion,
    public readonly relacion: string,
    public readonly fechaCreacion: Date,
    private _fechaActualizacion: Date,
  ) {}

  static crear(props: {
    id: string;
    personaId: string;
    vehiculoId: string;
    propietarioId: string;
    relacion: string;
    estado?: EstadoAutorizacion;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
  }): AutorizacionPermanente {
    const relacionStr = props.relacion?.trim() || 'No especificada';
    return new AutorizacionPermanente(
      props.id,
      props.personaId,
      props.vehiculoId,
      props.propietarioId,
      TipoAutorizacion.PERMANENTE,
      props.estado ?? EstadoAutorizacion.ACTIVA,
      relacionStr,
      props.fechaCreacion ?? new Date(),
      props.fechaActualizacion ?? new Date(),
    );
  }

  get estado(): EstadoAutorizacion {
    return this._estado;
  }

  get fechaActualizacion(): Date {
    return this._fechaActualizacion;
  }

  /** Serialización pública — evita filtrar los campos privados `_estado`/`_fechaActualizacion`. */
  toJSON() {
    return {
      id: this.id,
      personaId: this.personaId,
      vehiculoId: this.vehiculoId,
      propietarioId: this.propietarioId,
      tipo: this.tipo,
      estado: this.estado,
      relacion: this.relacion,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  private transicionar(nuevoEstado: EstadoAutorizacion): void {
    if (!esTransicionValida(this._estado, nuevoEstado)) {
      throw new BusinessRuleViolationException(
        'AutorizacionPermanente.transicionEstado',
        `No se puede pasar de ${this._estado} a ${nuevoEstado}`,
      );
    }
    this._estado = nuevoEstado;
    this._fechaActualizacion = new Date();
  }

  revocar(): void {
    this.transicionar(EstadoAutorizacion.REVOCADA);
  }

  desactivar(): void {
    this.transicionar(EstadoAutorizacion.INACTIVA);
  }

  reactivar(): void {
    this.transicionar(EstadoAutorizacion.ACTIVA);
  }

  estaActiva(): boolean {
    return this._estado === EstadoAutorizacion.ACTIVA;
  }
}
