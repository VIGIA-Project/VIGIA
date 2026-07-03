import { AuthorizationStatus } from '@shared/enums';

/**
 * Contrato para el BC de Authorization.
 */
export interface IAuthorizationContract {
  /**
   * Verifica si un vehículo está autorizado a ingresar.
   */
  isVehicleAuthorized(
    licensePlate: string,
    accessPointId: string,
    at?: Date,
  ): Promise<AuthorizationCheckResult>;

  /**
   * Verifica si una persona está autorizada.
   */
  isPersonAuthorized(
    personId: string,
    accessPointId: string,
    at?: Date,
  ): Promise<AuthorizationCheckResult>;
}

export interface AuthorizationCheckResult {
  authorized: boolean;
  status: AuthorizationStatus;
  reason?: string;
  authorizationId?: string;
  validUntil?: Date;
}

export const AUTHORIZATION_CONTRACT = Symbol('AUTHORIZATION_CONTRACT');
