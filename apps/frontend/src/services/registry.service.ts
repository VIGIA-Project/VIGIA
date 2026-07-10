// src/services/registry.service.ts
// Cliente del BC Registry (apps/backend/src/modules/registry) — solo lectura +
// alta de personas, que es lo que necesita hoy el dashboard de Propietario.

import { apiGetData, apiPostData, apiPatchData } from './api';
import { Persona, Vehiculo, CrearPersonaDto } from './types/registry.types';

export const crearPersona = (dto: CrearPersonaDto): Promise<Persona> => apiPostData('/registry/personas', dto);

export const buscarPersonaPorId = (personaId: string): Promise<Persona> =>
  apiGetData(`/registry/personas/${personaId}`);

export const marcarEnrollmentCompleto = (personaId: string): Promise<Persona> =>
  apiPatchData(`/registry/personas/${personaId}/enrollment-completo`);

export const buscarVehiculoPorId = (vehiculoId: string): Promise<Vehiculo> =>
  apiGetData(`/registry/vehiculos/${vehiculoId}`);

export const listarVehiculosDelPropietario = (propietarioPersonaId: string): Promise<Vehiculo[]> =>
  apiGetData(`/registry/vehiculos/propietario/${propietarioPersonaId}`);
