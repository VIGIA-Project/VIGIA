import { apiGet, apiPatch } from './api';

export const notificationService = {
  obtenerNotificaciones: async () => {
    return apiGet<any[]>('/notifications');
  },

  contarNoLeidas: async () => {
    const res = await apiGet<{ count: number }>('/notifications/count');
    return res.count;
  },

  marcarLeida: async (id: string) => {
    return apiPatch<any>(`/notifications/${id}/leer`);
  },
};
