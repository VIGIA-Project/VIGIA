import { TipoMovimiento, DecisionOperativa } from '../../domain/value-objects/evento-acceso.vo';

export class RegistrarEventoManualDto {
  placaCapturada: string;
  tipoMovimiento: TipoMovimiento;
  decision: DecisionOperativa;
  detalles: string;
  vehiculoId?: string;
  personaId?: string;
}

export class CrearPaseGaritaDto {
  placaVehiculo: string;
  tipoMovimiento: TipoMovimiento;
  tipoVisitante: string;
  nombreVisitante: string;
  documentoVisitante: string;
  destino: string;
  duracionHoras: number;
  descripcion: string;
}
