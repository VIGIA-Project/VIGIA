import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { EstadoAutorizacion, esTransicionValida } from '../value-objects/estado-autorizacion.vo';

/**
 * Aggregate Root — Miembro del Grupo Familiar.
 * Invariante: vincula una persona con un propietario.
 * Efecto operativo: acceso a todos los vehículos activos del propietario.
 */
export class MiembroGrupoFamiliar {
  static readonly LIMITE_MAXIMO = 5;

  private constructor(
    public readonly id: string,
    public readonly personaId: string,
    public readonly propietarioId: string,
    private _estado: EstadoAutorizacion,
    public readonly relacion: string,
    public readonly fechaCreacion: Date,
    private _fechaActualizacion: Date,
  ) {}

  static crear(props: {
    id: string;
    personaId: string;
    propietarioId: string;
    relacion: string;
    estado?: EstadoAutorizacion;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
  }): MiembroGrupoFamiliar {
    if (!props.relacion?.trim()) {
      throw new BusinessRuleViolationException(
        'MiembroGrupoFamiliar.relacion',
        'La relación no puede estar vacía',
      );
    }
    return new MiembroGrupoFamiliar(
      props.id,
      props.personaId,
      props.propietarioId,
      props.estado ?? EstadoAutorizacion.ACTIVA,
      props.relacion.trim(),
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
      propietarioId: this.propietarioId,
      estado: this.estado,
      relacion: this.relacion,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  private transicionar(nuevoEstado: EstadoAutorizacion): void {
    if (!esTransicionValida(this._estado, nuevoEstado)) {
      throw new BusinessRuleViolationException(
        'MiembroGrupoFamiliar.transicionEstado',
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
