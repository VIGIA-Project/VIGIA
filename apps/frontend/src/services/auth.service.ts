// src/services/auth.service.ts
// Operaciones de auth adicionales al login (que vive en pages/auth/Login.tsx).

import { apiPatchData } from './api';

export interface OnboardingStatusDto {
  biometric_registered?: boolean;
  vehicle_registered?: boolean;
}

export interface OnboardingStatusResponse {
  id: string;
  email: string;
  role: string;
  biometricRegistered: boolean;
  vehicleRegistered: boolean;
}

export const actualizarOnboardingStatus = (
  dto: OnboardingStatusDto
): Promise<OnboardingStatusResponse> => apiPatchData('/auth/users/me/onboarding-status', dto);
