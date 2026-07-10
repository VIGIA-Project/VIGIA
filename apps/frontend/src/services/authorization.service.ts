// src/services/authorization.service.ts
// Cliente del BC Authorization (apps/backend/src/modules/authorization)

import { apiGetData, apiPostData, apiPatchData } from './api';
import {
  AutorizacionPermanente,
  PermisoTemporal,
  PaseAccesoRapido,
  ConjuntoAutorizado,
  ResultadoValidacionPase,
  GenerarPaseResult,
  CrearAutorizacionPermanenteDto,
  CrearPermisoTemporalDto,
  CrearPaseRapidoDto,
} from './types/authorization.types';

// ─── Autorizaciones permanentes ──────────────────────────────────────────

export const crearAutorizacionPermanente = (
  dto: CrearAutorizacionPermanenteDto
): Promise<AutorizacionPermanente> => apiPostData('/authorization/permanentes', dto);

export const listarPorVehiculo = (vehiculoId: string): Promise<AutorizacionPermanente[]> =>
  apiGetData(`/authorization/permanentes/vehiculo/${vehiculoId}`);

export const listarActivasPorVehiculo = (vehiculoId: string): Promise<AutorizacionPermanente[]> =>
  apiGetData(`/authorization/permanentes/vehiculo/${vehiculoId}/activas`);

export const revocarAutorizacion = (id: string): Promise<AutorizacionPermanente> =>
  apiPatchData(`/authorization/permanentes/${id}/revocar`);

// ─── Permisos temporales ──────────────────────────────────────────────────

export const crearPermisoTemporal = (dto: CrearPermisoTemporalDto): Promise<PermisoTemporal> =>
  apiPostData('/authorization/temporales', dto);

export const listarVigentesPorVehiculo = (vehiculoId: string): Promise<PermisoTemporal[]> =>
  apiGetData(`/authorization/temporales/vehiculo/${vehiculoId}`);

export const listarPorPersona = (personaId: string): Promise<PermisoTemporal[]> =>
  apiGetData(`/authorization/temporales/persona/${personaId}`);

export const revocarPermiso = (id: string): Promise<PermisoTemporal> =>
  apiPatchData(`/authorization/temporales/${id}/revocar`);

// ─── Pases de acceso rápido ────────────────────────────────────────────────

export const generarPase = (dto: CrearPaseRapidoDto): Promise<GenerarPaseResult> =>
  apiPostData('/authorization/pases', dto);

export const listarMisPases = (): Promise<PaseAccesoRapido[]> => apiGetData('/authorization/pases/mis-pases');

export const listarActivosPorPlaca = (placa: string): Promise<PaseAccesoRapido[]> =>
  apiGetData(`/authorization/pases/placa/${placa}`);

export const validarPase = (codigo: string, placa: string): Promise<ResultadoValidacionPase> =>
  apiPostData('/authorization/pases/validar', { codigo, placa });

export const revocarPase = (id: string): Promise<PaseAccesoRapido> =>
  apiPatchData(`/authorization/pases/${id}/revocar`);

export const consumirPase = (id: string, eventoId: string): Promise<PaseAccesoRapido> =>
  apiPatchData(`/authorization/pases/${id}/consumir`, { eventoId });

// ─── Conjunto autorizado ────────────────────────────────────────────────────

export const obtenerConjuntoAutorizado = (vehiculoId: string): Promise<ConjuntoAutorizado> =>
  apiGetData(`/authorization/conjunto-autorizado/vehiculo/${vehiculoId}`);
