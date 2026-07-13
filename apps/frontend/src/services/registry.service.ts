// src/services/registry.service.ts
// Cliente del BC Registry (apps/backend/src/modules/registry) — solo lectura +
// alta de personas, que es lo que necesita hoy el dashboard de Propietario.

import { apiGetData, apiPostData, apiPatchData, apiDeleteData } from './api';
import {
  Persona,
  Vehiculo,
  CrearPersonaDto,
  ActualizarPersonaDto,
  CrearVehiculoDto,
  ActualizarVehiculoDto,
} from './types/registry.types';

export const crearPersona = (dto: CrearPersonaDto): Promise<Persona> => apiPostData('/registry/personas', dto);

export const buscarPersonaPorId = (personaId: string): Promise<Persona> =>
  apiGetData(`/registry/personas/${personaId}`);

export const actualizarPersona = (personaId: string, dto: ActualizarPersonaDto): Promise<Persona> =>
  apiPatchData(`/registry/personas/${personaId}`, dto);

export const marcarEnrollmentCompleto = (personaId: string): Promise<Persona> =>
  apiPatchData(`/registry/personas/${personaId}/enrollment-completo`);

export const buscarVehiculoPorId = (vehiculoId: string): Promise<Vehiculo> =>
  apiGetData(`/registry/vehiculos/${vehiculoId}`);

export const listarVehiculosDelPropietario = (propietarioPersonaId: string): Promise<Vehiculo[]> =>
  apiGetData(`/registry/vehiculos/propietario/${propietarioPersonaId}`);

export const crearVehiculo = (dto: CrearVehiculoDto): Promise<Vehiculo> => apiPostData('/registry/vehiculos', dto);

export const actualizarVehiculo = (vehiculoId: string, dto: ActualizarVehiculoDto): Promise<Vehiculo> =>
  apiPatchData(`/registry/vehiculos/${vehiculoId}`, dto);

export const eliminarVehiculo = (vehiculoId: string): Promise<void> =>
  apiDeleteData(`/registry/vehiculos/${vehiculoId}`);
