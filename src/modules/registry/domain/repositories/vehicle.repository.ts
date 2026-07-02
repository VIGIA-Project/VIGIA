export interface IVehicleRepository {
  save(vehicle: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByLicensePlate(licensePlate: string): Promise<any | null>;
  findByOwnerId(ownerId: string): Promise<any[]>;
  findAll(): Promise<any[]>;
  delete(id: string): Promise<void>;
}
