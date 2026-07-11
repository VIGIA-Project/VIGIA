import { TipoMovimiento } from '../value-objects/evento-acceso.vo';

export enum EstadoPaseGarita {
  ACTIVO = 'ACTIVO',
  FINALIZADO = 'FINALIZADO',
  EXPIRADO = 'EXPIRADO',
}

export class PaseGarita {
  constructor(
    public readonly id: string,
    public readonly placaVehiculo: string,
    public readonly tipoMovimiento: TipoMovimiento,
    public readonly tipoVisitante: string,
    public readonly nombreVisitante: string,
    public readonly documentoVisitante: string,
    public readonly destino: string,
    public readonly duracionHoras: number,
    public readonly descripcion: string,
    public estado: EstadoPaseGarita,
    public readonly guardiaId: string,
    public readonly createdAt: Date,
    public finalizadoAt: Date | null,
  ) {}

  finalizar(): void {
    this.estado = EstadoPaseGarita.FINALIZADO;
    this.finalizadoAt = new Date();
  }

  expirar(): void {
    this.estado = EstadoPaseGarita.EXPIRADO;
  }
}
