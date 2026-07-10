import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export interface Persona {
  personaId: string;
  identificacionTipo: string;
  identificacionNumero: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  correoInstitucional?: string;
  telefonoContacto?: string;
  rolInstitucional?: string;
  estadoRegistro: string;
  estadoBiometrico: string;
  createdAt: string;
}

export interface Vehiculo {
  vehiculoId: string;
  placa: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anio?: number;
  propietarioPersonaId: string;
  estadoRegistro: string;
}

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
