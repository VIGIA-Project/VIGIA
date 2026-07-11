import { apiGet, apiPost, apiPatch, apiDelete, apiGetData, apiPostData, apiPatchData } from './api';
import { Persona, Vehiculo, CrearPersonaDto } from './types/registry.types';
export type { Persona, Vehiculo, CrearPersonaDto };

export const registryService = {
  createPersona: (data: any) => apiPost<any>('/registry/personas', data),
  updatePersona: (id: string, data: Partial<Persona>) => apiPatch<Persona>(`/registry/personas/${id}`, data),
  getPersonas: () => apiGet<Persona[]>('/registry/personas'),
  getPersonaById: (id: string) => apiGet<Persona>(`/registry/personas/${id}`),
  getPersonasSinBiometria: () => apiGet<Persona[]>('/registry/personas/sin-biometria'),
  countPersonas: async () => {
    const res = await apiGet<{ count: number }>('/registry/personas/count');
    return res.count;
  },
  getVehiculos: () => apiGet<Vehiculo[]>('/registry/vehiculos'),
  getVehiculoById: (id: string) => apiGet<Vehiculo>(`/registry/vehiculos/${id}`),
  createVehiculo: (data: any) => apiPost<any>('/registry/vehiculos', data),
  updateVehiculo: (id: string, data: Partial<Vehiculo>) => apiPatch<Vehiculo>(`/registry/vehiculos/${id}`, data),
  deleteVehiculo: (id: string) => apiDelete<any>(`/registry/vehiculos/${id}`),
  countVehiculos: async () => {
    const res = await apiGet<{ count: number }>('/registry/vehiculos/count');
    return res.count;
  },
};

export const crearPersona = (dto: CrearPersonaDto): Promise<Persona> => apiPostData('/registry/personas', dto);

export const buscarPersonaPorId = (personaId: string): Promise<Persona> =>
  apiGetData(`/registry/personas/${personaId}`);

export const marcarEnrollmentCompleto = (personaId: string): Promise<Persona> =>
  apiPatchData(`/registry/personas/${personaId}/enrollment-completo`);

export const buscarVehiculoPorId = (vehiculoId: string): Promise<Vehiculo> =>
  apiGetData(`/registry/vehiculos/${vehiculoId}`);

export const listarVehiculosDelPropietario = (propietarioPersonaId: string): Promise<Vehiculo[]> =>
  apiGetData(`/registry/vehiculos/propietario/${propietarioPersonaId}`);
