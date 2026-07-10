import { TipoMovimiento, DecisionOperativa, OrigenResolucion } from '../value-objects/evento-acceso.vo';

export class EventoAcceso {
  constructor(
    public readonly id: string,
    public readonly tipoMovimiento: TipoMovimiento,
    public readonly decision: DecisionOperativa,
    public readonly origenResolucion: OrigenResolucion,
    public readonly timestampEvento: Date,
    public readonly motivoCodigo: string,
    public readonly vehiculoId?: string,
    public readonly personaId?: string,
    public readonly placaCapturada?: string,
    public readonly motivoDenegacion?: string,
  ) {}
}
