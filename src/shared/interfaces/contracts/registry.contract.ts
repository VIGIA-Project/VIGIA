import { VehicleType } from '@shared/enums';

/**
 * Contrato para el BC de Registry.
 */
export interface IRegistryContract {
  /**
   * Busca un vehículo por placa.
   */
  findVehicleByPlate(licensePlate: string): Promise<VehicleDto | null>;

  /**
   * Busca una persona por ID.
   */
  findPersonById(personId: string): Promise<PersonDto | null>;
}

export interface VehicleDto {
  id: string;
  licensePlate: string;
  type: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  ownerId?: string;
  registeredAt: Date;
}

export interface PersonDto {
  id: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  active: boolean;
}

export const REGISTRY_CONTRACT = Symbol('REGISTRY_CONTRACT');
