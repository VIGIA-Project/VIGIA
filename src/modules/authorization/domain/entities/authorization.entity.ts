import { AuthorizationStatus } from '@shared/enums';

/**
 * Entidad de dominio: Authorization
 * Permiso de acceso de un vehículo o persona a un punto de control.
 */
export class Authorization {
  private constructor(
    public readonly id: string,
    public readonly subjectId: string,       // vehicleId o personId
    public readonly subjectType: 'VEHICLE' | 'PERSON',
    public readonly accessPointId: string,
    public readonly status: AuthorizationStatus,
    public readonly validFrom: Date,
    public readonly validUntil: Date | undefined,
    public readonly allowedDays: string[],   // DayOfWeek[]
    public readonly allowedTimeStart: string | undefined, // HH:mm
    public readonly allowedTimeEnd: string | undefined,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    subjectId: string;
    subjectType: 'VEHICLE' | 'PERSON';
    accessPointId: string;
    status?: AuthorizationStatus;
    validFrom?: Date;
    validUntil?: Date;
    allowedDays?: string[];
    allowedTimeStart?: string;
    allowedTimeEnd?: string;
  }): Authorization {
    return new Authorization(
      props.id,
      props.subjectId,
      props.subjectType,
      props.accessPointId,
      props.status ?? AuthorizationStatus.ACTIVE,
      props.validFrom ?? new Date(),
      props.validUntil,
      props.allowedDays ?? [],
      props.allowedTimeStart,
      props.allowedTimeEnd,
      new Date(),
    );
  }

  isActive(): boolean {
    return this.status === AuthorizationStatus.ACTIVE;
  }

  isExpired(): boolean {
    return this.validUntil ? new Date() > this.validUntil : false;
  }
}
