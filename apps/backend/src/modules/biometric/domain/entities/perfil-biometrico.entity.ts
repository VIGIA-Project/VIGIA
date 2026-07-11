import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { EstadoDisponibilidad } from '../value-objects/estado-disponibilidad.vo';

/**
 * Aggregate Root — Perfil Biométrico.
 * Solo almacena el estado de disponibilidad de una persona para validación
 * biométrica; los embeddings (representaciones_biometricas) se capturan en
 * un flujo posterior, aún no conectado al servicio de IA.
 */
export class PerfilBiometrico {
  private constructor(
    public readonly id: string,
    public readonly personaId: string,
    private _estadoDisponibilidad: EstadoDisponibilidad,
    private _ultimaActualizacionBiometrica: Date | undefined,
    public readonly fechaCreacion: Date,
    private _fechaActualizacion: Date,
  ) {}

  static crear(props: {
    id: string;
    personaId: string;
    estadoDisponibilidad?: EstadoDisponibilidad;
    ultimaActualizacionBiometrica?: Date;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
  }): PerfilBiometrico {
    if (!props.personaId?.trim()) {
      throw new BusinessRuleViolationException(
        'PerfilBiometrico.personaId',
        'El perfil biométrico debe estar vinculado a una persona',
      );
    }
    return new PerfilBiometrico(
      props.id,
      props.personaId,
      props.estadoDisponibilidad ?? EstadoDisponibilidad.PENDIENTE_CAPTURA,
      props.ultimaActualizacionBiometrica,
      props.fechaCreacion ?? new Date(),
      props.fechaActualizacion ?? new Date(),
    );
  }

  get estadoDisponibilidad(): EstadoDisponibilidad {
    return this._estadoDisponibilidad;
  }

  get ultimaActualizacionBiometrica(): Date | undefined {
    return this._ultimaActualizacionBiometrica;
  }

  get fechaActualizacion(): Date {
    return this._fechaActualizacion;
  }

  /** Serialización pública — evita filtrar los campos privados con guion bajo. */
  toJSON() {
    return {
      perfilBiometricoId: this.id,
      personaId: this.personaId,
      estadoDisponibilidad: this.estadoDisponibilidad,
      ultimaActualizacionBiometrica: this.ultimaActualizacionBiometrica,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }
}
