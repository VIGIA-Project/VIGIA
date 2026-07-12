// src/services/admin.service.ts
// Cliente del dashboard ADMIN — endpoints de auth/users, conteos y consultas
// institucionales de Registry, Authorization, Biometric, Alerting y Access Control.

import { apiGetData, apiPostData, apiPatchData } from './api';
import {
  UsuarioAdmin,
  ListarUsuariosQuery,
  UsuariosPaginados,
  ResetPasswordResult,
  PerfilBiometrico,
  Alerta,
  Notificacion,
  EventoAcceso,
  RegistrarEventoManualDto,
} from './types/admin.types';
import { Persona, Vehiculo } from './types/registry.types';
import { PermisoTemporal, PaseAccesoRapido, ConjuntoAutorizado } from './types/authorization.types';

// ─── Auth — usuarios ────────────────────────────────────────────────────────

export const listarUsuarios = (query: ListarUsuariosQuery = {}): Promise<UsuariosPaginados> =>
  apiGetData('/auth/users', query as Record<string, unknown>);

export const buscarUsuarioPorId = (id: string): Promise<UsuarioAdmin> => apiGetData(`/auth/users/${id}`);

export const activarUsuario = (id: string): Promise<{ message: string }> =>
  apiPatchData(`/auth/users/${id}/activate`);

export const desactivarUsuario = (id: string): Promise<{ message: string }> =>
  apiPatchData(`/auth/users/${id}/deactivate`);

export const resetearPasswordUsuario = (id: string): Promise<ResetPasswordResult> =>
  apiPatchData(`/auth/users/${id}/reset-password`);

// ─── Registry — personas y vehículos ────────────────────────────────────────

export const listarPersonas = (): Promise<Persona[]> => apiGetData('/registry/personas');

export const contarPersonas = (): Promise<{ count: number }> => apiGetData('/registry/personas/count');

export const listarPersonasSinBiometria = (): Promise<Persona[]> => apiGetData('/registry/personas/sin-biometria');

export const listarVehiculos = (): Promise<Vehiculo[]> => apiGetData('/registry/vehiculos');

export const contarVehiculos = (): Promise<{ count: number }> => apiGetData('/registry/vehiculos/count');

export const buscarVehiculoPorPlaca = (placa: string): Promise<Vehiculo> =>
  apiGetData(`/registry/vehiculos/placa/${placa}`);

// ─── Authorization — conteos y consultas institucionales ───────────────────

export const contarMiembrosGrupoFamiliar = (): Promise<{ count: number }> =>
  apiGetData('/authorization/grupo-familiar/count');

export const contarPermisosTemporales = (): Promise<{ count: number }> =>
  apiGetData('/authorization/temporales/count');

export const listarPermisosProximosAExpirar = (dias = 7): Promise<PermisoTemporal[]> =>
  apiGetData('/authorization/temporales/proximos-expirar', { dias });

export const listarPermisosPorVehiculo = (vehiculoId: string): Promise<PermisoTemporal[]> =>
  apiGetData(`/authorization/temporales/vehiculo/${vehiculoId}`);

export const listarPermisosPorPersona = (personaId: string): Promise<PermisoTemporal[]> =>
  apiGetData(`/authorization/temporales/persona/${personaId}`);

export const revocarPermisoTemporal = (id: string): Promise<PermisoTemporal> =>
  apiPatchData(`/authorization/temporales/${id}/revocar`);

export const contarPasesActivos = (): Promise<{ count: number }> => apiGetData('/authorization/pases/count');

export const listarPasesPorPlaca = (placa: string): Promise<PaseAccesoRapido[]> =>
  apiGetData(`/authorization/pases/placa/${placa}`);

export const revocarPase = (id: string): Promise<PaseAccesoRapido> =>
  apiPatchData(`/authorization/pases/${id}/revocar`);

export const obtenerConjuntoAutorizadoPorVehiculo = (vehiculoId: string): Promise<ConjuntoAutorizado> =>
  apiGetData(`/authorization/conjunto-autorizado/vehiculo/${vehiculoId}`);

// ─── Biometric ───────────────────────────────────────────────────────────────

export const listarPerfilesBiometricos = (): Promise<PerfilBiometrico[]> => apiGetData('/biometric/perfiles');

export const contarPerfilesBiometricos = (): Promise<{ count: number }> => apiGetData('/biometric/perfiles/count');

export const buscarPerfilBiometricoPorPersona = (personaId: string): Promise<PerfilBiometrico | null> =>
  apiGetData(`/biometric/perfiles/persona/${personaId}`);

export const registrarPerfilBiometrico = (personaId: string): Promise<PerfilBiometrico> =>
  apiPostData(`/biometric/perfiles/persona/${personaId}`);

// ─── Alerting ────────────────────────────────────────────────────────────────

export const listarAlertasRecientes = (limite = 10): Promise<Alerta[]> =>
  apiGetData('/alerting/alertas/recientes', { limite });

export const contarAlertasNoAtendidas = (): Promise<{ count: number }> => apiGetData('/alerting/alertas/count');

export const marcarAlertaAtendida = (id: string): Promise<Alerta> =>
  apiPatchData(`/alerting/alertas/${id}/atender`);

export const listarNotificaciones = (): Promise<Notificacion[]> => apiGetData('/alerting/notificaciones');

export const marcarNotificacionLeida = (id: string): Promise<Notificacion> =>
  apiPatchData(`/alerting/notificaciones/${id}/leer`);

// ─── Access Control ──────────────────────────────────────────────────────────

export const listarEventosRecientes = (limite = 10): Promise<EventoAcceso[]> =>
  apiGetData('/access-control/eventos/recientes', { limite });

export const contarEventosHoy = (): Promise<{ count: number }> => apiGetData('/access-control/eventos/count');

export const obtenerMetricasAccesosHoy = (): Promise<{ exitosos: number; pendientes: number; denegados: number }> =>
  apiGetData('/access-control/eventos/metrics');

export const registrarEventoManual = (dto: RegistrarEventoManualDto): Promise<EventoAcceso> =>
  apiPostData('/access-control/eventos/manual', dto);
