import { apiGet, apiPost, apiGetData, apiPatchData } from './api';

export const accessControlService = {
  obtenerEventosRecientes: async (limite = 7) => {
    return apiGet<any[]>(`/access-control/eventos/recientes?limite=${limite}`);
  },
  registrarEventoManual: async (datos: any) => {
    return apiPost<any>('/access-control/eventos/manual', datos);
  },
  crearPaseGarita: async (datos: any) => {
    return apiPost<any>('/access-control/pases-garita', datos);
  },
  listarPasesGarita: async () => {
    return apiGetData<any[]>('/access-control/pases-garita');
  },
  contarPasesGaritaActivos: async () => {
    const res = await apiGet<{ count: number }>('/access-control/pases-garita/count');
    return res.count;
  },
  buscarVehiculoPorPlaca: async (placa: string) => {
    return apiGetData<any>(`/registry/vehiculos/placa/${placa}`);
  },
  finalizarPase: async (id: string) => {
    return apiPatchData<any>(`/access-control/pases-garita/${id}/finalizar`, {});
  }
};
