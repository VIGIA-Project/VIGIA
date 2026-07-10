import { apiGet } from './api';

export const biometricService = {
  contarPerfiles: async () => {
    const res = await apiGet<{ count: number }>('/biometric/perfiles/count');
    return res.count;
  },
};
