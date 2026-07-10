import { apiGet } from './api';

export const accessControlService = {
  obtenerEventosRecientes: async (limite = 7) => {
    return apiGet<any[]>(`/access-control/eventos/recientes?limite=${limite}`);
  },
};
