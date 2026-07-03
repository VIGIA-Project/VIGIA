import { AccessEventType, AccessStatus } from '@shared/enums';

/**
 * Contrato para el BC de Access Control.
 * Otros BCs deben usar esta interfaz para comunicarse con Access Control.
 */
export interface IAccessControlContract {
  /**
   * Registra un evento de acceso (entrada/salida).
   */
  registerAccessEvent(event: AccessEventRequest): Promise<AccessEventResponse>;

  /**
   * Consulta el último evento de acceso de un vehículo.
   */
  getLastAccessEvent(licensePlate: string): Promise<AccessEventResponse | null>;
}

export interface AccessEventRequest {
  licensePlate: string;
  accessPointId: string;
  eventType: AccessEventType;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface AccessEventResponse {
  id: string;
  licensePlate: string;
  accessPointId: string;
  eventType: AccessEventType;
  status: AccessStatus;
  timestamp: Date;
}

export const ACCESS_CONTROL_CONTRACT = Symbol('ACCESS_CONTROL_CONTRACT');
