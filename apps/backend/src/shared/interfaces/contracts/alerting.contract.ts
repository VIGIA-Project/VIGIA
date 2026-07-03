import { AlertSeverity, AlertChannel } from '@shared/enums';

/**
 * Contrato para el BC de Alerting.
 */
export interface IAlertingContract {
  /**
   * Emite una alerta desde cualquier BC.
   */
  emitAlert(alert: EmitAlertRequest): Promise<EmitAlertResult>;
}

export interface EmitAlertRequest {
  title: string;
  message: string;
  severity: AlertSeverity;
  sourceContext: string; // BC que emite la alerta
  sourceEntityId?: string;
  channels?: AlertChannel[];
  metadata?: Record<string, unknown>;
}

export interface EmitAlertResult {
  alertId: string;
  emittedAt: Date;
  channels: AlertChannel[];
}

export const ALERTING_CONTRACT = Symbol('ALERTING_CONTRACT');
