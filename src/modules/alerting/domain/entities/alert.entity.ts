import { AlertSeverity, AlertStatus, AlertChannel } from '@shared/enums';

/**
 * Entidad de dominio: Alert
 */
export class Alert {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly message: string,
    public readonly severity: AlertSeverity,
    public readonly status: AlertStatus,
    public readonly sourceContext: string,
    public readonly sourceEntityId: string | undefined,
    public readonly channels: AlertChannel[],
    public readonly createdAt: Date,
    public readonly acknowledgedAt: Date | undefined,
    public readonly resolvedAt: Date | undefined,
  ) {}

  static create(props: {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    sourceContext: string;
    sourceEntityId?: string;
    channels?: AlertChannel[];
  }): Alert {
    return new Alert(
      props.id,
      props.title,
      props.message,
      props.severity,
      AlertStatus.PENDING,
      props.sourceContext,
      props.sourceEntityId,
      props.channels ?? [AlertChannel.IN_APP],
      new Date(),
      undefined,
      undefined,
    );
  }

  isCritical(): boolean {
    return this.severity === AlertSeverity.CRITICAL;
  }

  isPending(): boolean {
    return this.status === AlertStatus.PENDING;
  }
}
