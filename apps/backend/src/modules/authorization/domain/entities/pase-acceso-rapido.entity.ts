import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { EstadoPase, esTransicionPaseValida } from '../value-objects/estado-pase.vo';
import { Vigencia } from '../value-objects/vigencia.vo';
import { CodigoAccesoTemporal } from '../value-objects/codigo-acceso-temporal.vo';

/**
 * Aggregate Root — Pase de Acceso Rápido.
 * Invariante: código solo se almacena como hash, un único uso, no crea Persona
 * en Registry ni ejecuta biometría.
 */
export class PaseAccesoRapido {
  private constructor(
    public readonly id: string,
    public readonly vehiculoId: string,
    public readonly propietarioId: string,
    public readonly placa: string,
    public readonly codigoHash: string,
    private _estado: EstadoPase,
    public readonly vigencia: Vigencia,
    public readonly nombreVisitante: string,
    public readonly cedulaVisitante: string,
    public readonly motivo: string,
    public readonly fechaCreacion: Date,
    private _fechaConsumo: Date | undefined,
    private _eventoConsumoId: string | undefined,
  ) {}

  static crear(props: {
    id: string;
    vehiculoId: string;
    propietarioId: string;
    placa: string;
    codigoHash: string;
    vigencia: Vigencia;
    nombreVisitante: string;
    cedulaVisitante: string;
    motivo: string;
    estado?: EstadoPase;
    fechaCreacion?: Date;
    fechaConsumo?: Date;
    eventoConsumoId?: string;
  }): PaseAccesoRapido {
    if (!props.nombreVisitante?.trim()) {
      throw new BusinessRuleViolationException(
        'PaseAccesoRapido.nombreVisitante',
        'El nombre del visitante no puede estar vacío',
      );
    }
    if (!props.motivo?.trim()) {
      throw new BusinessRuleViolationException(
        'PaseAccesoRapido.motivo',
        'El motivo no puede estar vacío',
      );
    }
    return new PaseAccesoRapido(
      props.id,
      props.vehiculoId,
      props.propietarioId,
      props.placa.toUpperCase().replace(/[^A-Z0-9]/g, '').trim(),
      props.codigoHash,
      props.estado ?? EstadoPase.ACTIVO,
      props.vigencia,
      props.nombreVisitante.trim(),
      props.cedulaVisitante?.trim() ?? '',
      props.motivo.trim(),
      props.fechaCreacion ?? new Date(),
      props.fechaConsumo,
      props.eventoConsumoId,
    );
  }

  static async generarCodigo(): Promise<{ codigoPlano: string; codigoHash: string }> {
    return CodigoAccesoTemporal.generar();
  }

  get estado(): EstadoPase {
    return this._estado;
  }

  get fechaConsumo(): Date | undefined {
    return this._fechaConsumo;
  }

  get eventoConsumoId(): string | undefined {
    return this._eventoConsumoId;
  }

  /**
   * Serialización pública — evita filtrar los campos privados
   * (`_estado`, `_fechaConsumo`, `_eventoConsumoId`) y, crucialmente,
   * el `codigoHash` (nunca debe viajar en una respuesta HTTP).
   */
  toJSON() {
    return {
      id: this.id,
      vehiculoId: this.vehiculoId,
      propietarioId: this.propietarioId,
      placa: this.placa,
      estado: this.estado,
      vigenciaInicio: this.vigencia.inicio,
      vigenciaFin: this.vigencia.fin,
      nombreVisitante: this.nombreVisitante,
      cedulaVisitante: this.cedulaVisitante,
      motivo: this.motivo,
      fechaCreacion: this.fechaCreacion,
      fechaConsumo: this.fechaConsumo,
      eventoConsumoId: this.eventoConsumoId,
    };
  }

  consumir(eventoId: string): void {
    if (!esTransicionPaseValida(this._estado, EstadoPase.CONSUMIDO)) {
      throw new BusinessRuleViolationException(
        'PaseAccesoRapido.consumir',
        `No se puede consumir un pase en estado ${this._estado}`,
      );
    }
    this._estado = EstadoPase.CONSUMIDO;
    this._fechaConsumo = new Date();
    this._eventoConsumoId = eventoId;
  }

  revocar(): void {
    if (!esTransicionPaseValida(this._estado, EstadoPase.REVOCADO)) {
      throw new BusinessRuleViolationException(
        'PaseAccesoRapido.revocar',
        `No se puede revocar un pase en estado ${this._estado}`,
      );
    }
    this._estado = EstadoPase.REVOCADO;
  }

  expirar(): void {
    if (!esTransicionPaseValida(this._estado, EstadoPase.EXPIRADO)) {
      throw new BusinessRuleViolationException(
        'PaseAccesoRapido.expirar',
        `No se puede expirar un pase en estado ${this._estado}`,
      );
    }
    this._estado = EstadoPase.EXPIRADO;
  }

  estaDisponible(instante: Date = new Date()): boolean {
    return this._estado === EstadoPase.ACTIVO && this.vigencia.estaVigente(instante);
  }
}
