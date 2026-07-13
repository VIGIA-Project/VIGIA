import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { SeveridadAlerta } from '../value-objects/severidad-alerta.vo';
import { EstadoAtencionAlerta } from '../value-objects/estado-atencion-alerta.vo';

/**
 * Aggregate Root — Alerta.
 * Emitida por otro Bounded Context (p. ej. Access Control) a partir de un
 * evento origen; este BC solo administra su ciclo de atención.
 */
export class Alerta {
  private constructor(
    public readonly id: string,
    public readonly causaOrigen: string,
    public readonly referenciaOrigenId: string,
    public readonly vehiculoId: string | undefined,
    public readonly severidad: SeveridadAlerta,
    private _estadoAtencion: EstadoAtencionAlerta,
    public readonly mensajeResumen: string,
    public readonly generadaEn: Date,
    private _atendidaEn: Date | undefined,
  ) {}

  static crear(props: {
    id: string;
    causaOrigen: string;
    referenciaOrigenId: string;
    vehiculoId?: string;
    severidad: SeveridadAlerta;
    mensajeResumen: string;
    estadoAtencion?: EstadoAtencionAlerta;
    generadaEn?: Date;
    atendidaEn?: Date;
  }): Alerta {
    return new Alerta(
      props.id,
      props.causaOrigen,
      props.referenciaOrigenId,
      props.vehiculoId,
      props.severidad,
      props.estadoAtencion ?? EstadoAtencionAlerta.GENERADA,
      props.mensajeResumen,
      props.generadaEn ?? new Date(),
      props.atendidaEn,
    );
  }

  get estadoAtencion(): EstadoAtencionAlerta {
    return this._estadoAtencion;
  }

  get atendidaEn(): Date | undefined {
    return this._atendidaEn;
  }

  marcarAtendida(): void {
    if (this._estadoAtencion === EstadoAtencionAlerta.ATENDIDA) {
      throw new BusinessRuleViolationException(
        'Alerta.marcarAtendida',
        'La alerta ya fue atendida',
      );
    }
    this._estadoAtencion = EstadoAtencionAlerta.ATENDIDA;
    this._atendidaEn = new Date();
  }

  toJSON() {
    return {
      alertaId: this.id,
      causaOrigen: this.causaOrigen,
      referenciaOrigenId: this.referenciaOrigenId,
      vehiculoId: this.vehiculoId,
      severidad: this.severidad,
      estadoAtencion: this.estadoAtencion,
      mensajeResumen: this.mensajeResumen,
      generadaEn: this.generadaEn,
      atendidaEn: this.atendidaEn,
    };
  }
}
