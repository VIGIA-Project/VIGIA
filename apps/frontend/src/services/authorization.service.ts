import { apiGet } from './api';

export interface AutorizacionPermanente {
  id: string;
  personaId: string;
  vehiculoId: string;
  propietarioId: string;
  tipo: string;
  estado: string;
  relacion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PermisoTemporal {
  id: string;
  personaId: string;
  vehiculoId: string;
  propietarioId: string;
  motivo: string;
  vigencia: {
    inicio: string;
    fin: string;
  };
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export const authorizationService = {
  getTodasPermanentes: () => apiGet<AutorizacionPermanente[]>('/authorization/permanentes'),
  countPermanentes: async () => {
    const res = await apiGet<{ count: number }>('/authorization/permanentes/count');
    return res.count;
  },
  getTodosTemporales: () => apiGet<PermisoTemporal[]>('/authorization/temporales'),
  countTemporales: async () => {
    const res = await apiGet<{ count: number }>('/authorization/temporales/count');
    return res.count;
  },
  getTemporalesProximosAExpirar: () => apiGet<PermisoTemporal[]>('/authorization/temporales/proximos-expirar?dias=2'),
  getConjuntoAutorizado: (vehiculoId: string) => apiGet<any>(`/authorization/conjunto-autorizado/vehiculo/${vehiculoId}`),
};
