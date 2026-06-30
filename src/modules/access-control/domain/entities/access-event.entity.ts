import { AccessEventType, AccessStatus } from '@shared/enums';

/**
 * Entidad de dominio: AccessEvent
 * Representa un evento de acceso vehicular (entrada/salida/denegado).
 * SIN dependencias de ORM en el dominio.
 */
export class AccessEvent {
  private constructor(
    public readonly id: string,
    public readonly licensePlate: string,
    public readonly accessPointId: string,
    public readonly eventType: AccessEventType,
    public readonly status: AccessStatus,
    public readonly timestamp: Date,
    public readonly metadata?: Record<string, unknown>,
  ) {}

  static create(props: {
    id: string;
    licensePlate: string;
    accessPointId: string;
    eventType: AccessEventType;
    status: AccessStatus;
    timestamp?: Date;
    metadata?: Record<string, unknown>;
  }): AccessEvent {
    return new AccessEvent(
      props.id,
      props.licensePlate,
      props.accessPointId,
      props.eventType,
      props.status,
      props.timestamp ?? new Date(),
      props.metadata,
    );
  }

  isGranted(): boolean {
    return this.status === AccessStatus.GRANTED;
  }

  isDenied(): boolean {
    return this.status === AccessStatus.DENIED;
  }
}
