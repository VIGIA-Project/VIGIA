/**
 * Contrato de repositorio para AccessEvent.
 * Solo el dominio define la interfaz; la infraestructura la implementa.
 */
export interface IAccessEventRepository {
  save(event: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByLicensePlate(licensePlate: string, limit?: number): Promise<any[]>;
  findLastByLicensePlate(licensePlate: string): Promise<any | null>;
  findByAccessPoint(accessPointId: string, from: Date, to: Date): Promise<any[]>;
}

export interface IAccessPointRepository {
  save(point: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  findActive(): Promise<any[]>;
}
