import { VehicleType } from '@shared/enums';

/**
 * Entidad de dominio: Vehicle
 */
export class Vehicle {
  private constructor(
    public readonly id: string,
    public readonly licensePlate: string,
    public readonly type: VehicleType,
    public readonly brand: string | undefined,
    public readonly model: string | undefined,
    public readonly color: string | undefined,
    public readonly ownerId: string | undefined,
    public readonly active: boolean,
    public readonly registeredAt: Date,
  ) {}

  static create(props: {
    id: string;
    licensePlate: string;
    type: VehicleType;
    brand?: string;
    model?: string;
    color?: string;
    ownerId?: string;
    active?: boolean;
    registeredAt?: Date;
  }): Vehicle {
    return new Vehicle(
      props.id,
      props.licensePlate.toUpperCase().replace(/\s/g, ''),
      props.type,
      props.brand,
      props.model,
      props.color,
      props.ownerId,
      props.active ?? true,
      props.registeredAt ?? new Date(),
    );
  }

  isActive(): boolean {
    return this.active;
  }
}
