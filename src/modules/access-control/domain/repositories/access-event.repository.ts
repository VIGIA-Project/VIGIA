import { AccessEvent } from '../entities/access-event.entity';
import { AccessPoint } from '../entities/access-point.entity';

/**
 * Contrato de repositorio para AccessEvent.
 * Solo el dominio define la interfaz; la infraestructura la implementa.
 */
export interface IAccessEventRepository {
  save(event: AccessEvent): Promise<AccessEvent>;
  findById(id: string): Promise<AccessEvent | null>;
  findByLicensePlate(licensePlate: string, limit?: number): Promise<AccessEvent[]>;
  findLastByLicensePlate(licensePlate: string): Promise<AccessEvent | null>;
  findByAccessPoint(accessPointId: string, from: Date, to: Date): Promise<AccessEvent[]>;
}

export interface IAccessPointRepository {
  save(point: AccessPoint): Promise<AccessPoint>;
  findById(id: string): Promise<AccessPoint | null>;
  findAll(): Promise<AccessPoint[]>;
  findActive(): Promise<AccessPoint[]>;
}
