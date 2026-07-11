import { BusinessRuleViolationException } from '@core/exceptions/domain-exception';
import { TipoMovimiento } from '../value-objects/tipo-movimiento.vo';
import { DecisionOperativa } from '../value-objects/decision-operativa.vo';
import { OrigenResolucion } from '../value-objects/origen-resolucion.vo';

/**
 * Aggregate Root — Evento de Acceso.
 * Registra el paso (o intento de paso) de un vehículo por un punto de
 * control, ya sea resuelto automáticamente o de forma manual por un guardia.
 */
export class EventoAcceso {
  private constructor(
    public readonly id: string,
    public readonly vehiculoId: string | undefined,
    public readonly personaDetectadaId: string | undefined,
    public readonly placaObservada: string,
    public readonly tipoMovimiento: TipoMovimiento,
    public readonly decisionOperativa: DecisionOperativa,
    public readonly motivoCodigo: string,
    public readonly motivoDetalle: string | undefined,
    public readonly origenResolucion: OrigenResolucion,
    public readonly capturadoEn: Date,
    public readonly resueltoEn: Date | undefined,
  ) {}

  static crear(props: {
    id: string;
    vehiculoId?: string;
    personaDetectadaId?: string;
    placaObservada: string;
    tipoMovimiento: TipoMovimiento;
    decisionOperativa: DecisionOperativa;
    motivoCodigo: string;
    motivoDetalle?: string;
    origenResolucion: OrigenResolucion;
    capturadoEn?: Date;
    resueltoEn?: Date;
  }): EventoAcceso {
    if (!props.placaObservada?.trim()) {
      throw new BusinessRuleViolationException(
        'EventoAcceso.placaObservada',
        'La placa observada no puede estar vacía',
      );
    }
    if (!props.motivoCodigo?.trim()) {
      throw new BusinessRuleViolationException(
        'EventoAcceso.motivoCodigo',
        'El motivo del evento no puede estar vacío',
      );
    }
    return new EventoAcceso(
      props.id,
      props.vehiculoId,
      props.personaDetectadaId,
      props.placaObservada.toUpperCase().replace(/[^A-Z0-9]/g, '').trim(),
      props.tipoMovimiento,
      props.decisionOperativa,
      props.motivoCodigo.trim(),
      props.motivoDetalle?.trim(),
      props.origenResolucion,
      props.capturadoEn ?? new Date(),
      props.resueltoEn,
    );
  }

  toJSON() {
    return {
      eventoAccesoId: this.id,
      vehiculoId: this.vehiculoId,
      personaDetectadaId: this.personaDetectadaId,
      placaObservada: this.placaObservada,
      tipoMovimiento: this.tipoMovimiento,
      decisionOperativa: this.decisionOperativa,
      motivoCodigo: this.motivoCodigo,
      motivoDetalle: this.motivoDetalle,
      origenResolucion: this.origenResolucion,
      capturadoEn: this.capturadoEn,
      resueltoEn: this.resueltoEn,
    };
  }
}
