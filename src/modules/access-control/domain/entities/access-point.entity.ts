/**
 * Entidad de dominio: AccessPoint
 * Punto físico de control de acceso (barrera, puerta, etc.).
 */
export class AccessPoint {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly location: string,
    public readonly active: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    name: string;
    location: string;
    active?: boolean;
    createdAt?: Date;
  }): AccessPoint {
    return new AccessPoint(
      props.id,
      props.name,
      props.location,
      props.active ?? true,
      props.createdAt ?? new Date(),
    );
  }

  isActive(): boolean {
    return this.active;
  }
}
