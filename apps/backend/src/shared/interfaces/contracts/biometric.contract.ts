import { BiometricType } from '@shared/enums';

/**
 * Contrato para el BC de Biometric.
 */
export interface IBiometricContract {
  /**
   * Verifica una muestra biométrica contra un perfil registrado.
   */
  verifyBiometric(request: BiometricVerificationRequest): Promise<BiometricVerificationResult>;

  /**
   * Registra un perfil biométrico.
   */
  enrollBiometric(request: BiometricEnrollRequest): Promise<BiometricEnrollResult>;
}

export interface BiometricVerificationRequest {
  subjectId: string;
  type: BiometricType;
  sample: string; // Base64 encoded sample
  threshold?: number;
}

export interface BiometricVerificationResult {
  verified: boolean;
  confidence: number;
  matchedProfileId?: string;
}

export interface BiometricEnrollRequest {
  subjectId: string;
  type: BiometricType;
  sample: string; // Base64 encoded sample
  metadata?: Record<string, unknown>;
}

export interface BiometricEnrollResult {
  profileId: string;
  subjectId: string;
  type: BiometricType;
  enrolledAt: Date;
}

export const BIOMETRIC_CONTRACT = Symbol('BIOMETRIC_CONTRACT');
