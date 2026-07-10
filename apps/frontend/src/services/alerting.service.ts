import { apiGet } from './api';

export const alertingService = {
  obtenerAlertasRecientes: async (limite = 6) => {
    return apiGet<any[]>(`/alerting/alertas/recientes?limite=${limite}`);
  },

  contarAlertas: async () => {
    const res = await apiGet<{ count: number }>('/alerting/alertas/count');
    return res.count;
  },
};
