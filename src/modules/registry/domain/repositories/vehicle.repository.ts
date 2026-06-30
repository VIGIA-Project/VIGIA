import { Vehicle } from '../entities/vehicle.entity';

export interface IVehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  findByOwnerId(ownerId: string): Promise<Vehicle[]>;
  findAll(): Promise<Vehicle[]>;
  delete(id: string): Promise<void>;
}
