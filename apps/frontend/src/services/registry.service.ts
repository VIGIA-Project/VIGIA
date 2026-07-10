import { apiGet, apiPost } from './api';

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
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  propietarioPersonaId: string;
  estado: string;
}

export const registryService = {
  createPersona: (data: any) => apiPost<any>('/registry/personas', data),
  getPersonas: () => apiGet<Persona[]>('/registry/personas'),
  getPersonasSinBiometria: () => apiGet<Persona[]>('/registry/personas/sin-biometria'),
  countPersonas: async () => {
    const res = await apiGet<{ count: number }>('/registry/personas/count');
    return res.count;
  },
  getVehiculos: () => apiGet<Vehiculo[]>('/registry/vehiculos'),
  countVehiculos: async () => {
    const res = await apiGet<{ count: number }>('/registry/vehiculos/count');
    return res.count;
  },
};
