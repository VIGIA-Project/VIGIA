import { SeveridadAlerta, EstadoAtencionAlerta } from '../value-objects/alerta.vo';

export class Alerta {
  constructor(
    public readonly id: string,
    public readonly causaOrigen: string,
    public readonly referenciaOrigenId: string,
    public readonly severidad: SeveridadAlerta,
    public estadoAtencion: EstadoAtencionAlerta,
    public readonly mensajeResumen: string,
    public readonly generadaEn: Date,
    public atendidaEn: Date | null,
    public readonly vehiculoId?: string,
  ) {}
}
