import { apiGet, apiPost, apiPatch, apiPatchData } from './api';

export enum UserRole {
  ADMIN = 'ADMIN',
  GUARD = 'GUARD',
  USER = 'USER',
  OWNER = 'OWNER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_PASSWORD_CHANGE = 'PENDING_PASSWORD_CHANGE',
  BLOCKED = 'BLOCKED',
}

export interface UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean;
  personaId?: string;
  biometricRegistered: boolean;
  vehicleRegistered: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUsersResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

export const authService = {
  getUsers: async (page = 1, limit = 100) => {
    return apiGet<PaginatedUsersResponseDto>(`/auth/users`, { page, limit });
  },

  createUser: async (data: { email: string; role: string; temporaryPassword?: string; personaId?: string }) => {
    return apiPost<UserResponseDto>('/auth/users', data);
  },

  activateUser: async (id: string) => {
    return apiPatch<{ message: string }>(`/auth/users/${id}/activate`);
  },

  deactivateUser: async (id: string) => {
    return apiPatch<{ message: string }>(`/auth/users/${id}/deactivate`);
  },

  resetPassword: async (id: string) => {
    return apiPatch<{ temporaryPassword: string }>(`/auth/users/${id}/reset-password`);
  }
};
