import { apiGet, apiPost } from './api';

export const biometricService = {
  contarPerfiles: async () => {
    const res = await apiGet<{ count: number }>('/biometric/perfiles/count');
    return res.count;
  },

  registrarPerfilBiometrico: async () => {
    return apiPost<{ success: boolean; message: string }>('/biometric/perfiles/me', {});
  },

  registrarPerfilPersona: async (personaId: string) => {
    return apiPost<{ success: boolean; message: string }>(`/biometric/perfiles/persona/${personaId}`, {});
  },

  obtenerTodos: async () => {
    return apiGet<any[]>('/biometric/perfiles');
  }
};
