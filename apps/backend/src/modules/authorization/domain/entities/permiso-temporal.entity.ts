import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { EstadoAutorizacion, esTransicionValida } from '../value-objects/estado-autorizacion.vo';
import { TipoAutorizacion } from '../value-objects/tipo-autorizacion.vo';
import { Vigencia } from '../value-objects/vigencia.vo';

const VIGENCIA_MAXIMA_DIAS = 30;

/**
 * Aggregate Root — Permiso Temporal.
 * Invariante: vigencia máxima de 30 días, sin estado PROGRAMADO, revocación ≠ expiración.
 */
export class PermisoTemporal {
  private constructor(
    public readonly id: string,
    public readonly personaId: string,
    public readonly vehiculoId: string,
    public readonly propietarioId: string,
    public readonly tipo: TipoAutorizacion,
    private _estado: EstadoAutorizacion,
    public readonly vigencia: Vigencia,
    public readonly motivo: string,
    public readonly fechaCreacion: Date,
    private _fechaRevocacion: Date | undefined,
  ) {}

  static crear(props: {
    id: string;
    personaId: string;
    vehiculoId: string;
    propietarioId: string;
    vigencia: Vigencia;
    motivo: string;
    estado?: EstadoAutorizacion;
    fechaCreacion?: Date;
    fechaRevocacion?: Date;
  }): PermisoTemporal {
    if (!props.motivo?.trim()) {
      throw new BusinessRuleViolationException(
        'PermisoTemporal.motivo',
        'El motivo no puede estar vacío',
      );
    }
    const permiso = new PermisoTemporal(
      props.id,
      props.personaId,
      props.vehiculoId,
      props.propietarioId,
      TipoAutorizacion.TEMPORAL,
      props.estado ?? EstadoAutorizacion.ACTIVA,
      props.vigencia,
      props.motivo.trim(),
      props.fechaCreacion ?? new Date(),
      props.fechaRevocacion,
    );
    permiso.validarVigenciaMaxima();
    return permiso;
  }

  get estado(): EstadoAutorizacion {
    return this._estado;
  }

  get fechaRevocacion(): Date | undefined {
    return this._fechaRevocacion;
  }

  /** Serialización pública — evita filtrar los campos privados `_estado`/`_fechaRevocacion`. */
  toJSON() {
    return {
      id: this.id,
      personaId: this.personaId,
      vehiculoId: this.vehiculoId,
      propietarioId: this.propietarioId,
      tipo: this.tipo,
      estado: this.estado,
      vigenciaInicio: this.vigencia.inicio,
      vigenciaFin: this.vigencia.fin,
      motivo: this.motivo,
      fechaCreacion: this.fechaCreacion,
      fechaRevocacion: this.fechaRevocacion,
    };
  }

  validarVigenciaMaxima(): void {
    if (this.vigencia.duracionEnDias() > VIGENCIA_MAXIMA_DIAS) {
      throw new BusinessRuleViolationException(
        'PermisoTemporal.vigenciaMaxima',
        `La vigencia máxima de un permiso temporal es de ${VIGENCIA_MAXIMA_DIAS} días`,
      );
    }
  }

  revocar(): void {
    if (!esTransicionValida(this._estado, EstadoAutorizacion.REVOCADA)) {
      throw new BusinessRuleViolationException(
        'PermisoTemporal.revocar',
        `No se puede revocar un permiso en estado ${this._estado}`,
      );
    }
    this._estado = EstadoAutorizacion.REVOCADA;
    this._fechaRevocacion = new Date();
  }

  expirar(): void {
    if (!esTransicionValida(this._estado, EstadoAutorizacion.EXPIRADA)) {
      throw new BusinessRuleViolationException(
        'PermisoTemporal.expirar',
        `No se puede expirar un permiso en estado ${this._estado}`,
      );
    }
    this._estado = EstadoAutorizacion.EXPIRADA;
  }

  estaVigente(instante: Date = new Date()): boolean {
    return this._estado === EstadoAutorizacion.ACTIVA && this.vigencia.estaVigente(instante);
  }
}
