// src/hooks/useAdmin.ts
// Hooks TanStack Query para el dashboard ADMIN.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminService from '../services/admin.service';
import * as registryService from '../services/registry.service';
import { CrearUsuarioDto, ListarUsuariosQuery, RegistrarEventoManualDto } from '../services/types/admin.types';
import { CrearAsignacionRolDto } from '../services/types/registry.types';

export const adminKeys = {
  usuarios: (query: ListarUsuariosQuery) => ['admin', 'usuarios', query] as const,
  usuario: (id?: string) => ['admin', 'usuario', id] as const,
  personas: () => ['admin', 'personas'] as const,
  personasCount: () => ['admin', 'personas', 'count'] as const,
  personasSinBiometria: () => ['admin', 'personas', 'sin-biometria'] as const,
  vehiculos: () => ['admin', 'vehiculos'] as const,
  vehiculosCount: () => ['admin', 'vehiculos', 'count'] as const,
  vehiculoPorPlaca: (placa?: string) => ['admin', 'vehiculo-placa', placa] as const,
  vehiculoPorId: (id?: string) => ['admin', 'vehiculo', id] as const,
  grupoFamiliarCount: () => ['admin', 'grupo-familiar', 'count'] as const,
  temporalesCount: () => ['admin', 'temporales', 'count'] as const,
  temporalesProximosAExpirar: (dias: number) => ['admin', 'temporales', 'proximos-expirar', dias] as const,
  temporalesPorVehiculo: (vehiculoId?: string) => ['admin', 'temporales', 'vehiculo', vehiculoId] as const,
  temporalesPorPersona: (personaId?: string) => ['admin', 'temporales', 'persona', personaId] as const,
  pasesCount: () => ['admin', 'pases', 'count'] as const,
  pasesPorPlaca: (placa?: string) => ['admin', 'pases', 'placa', placa] as const,
  conjuntoAutorizado: (vehiculoId?: string) => ['admin', 'conjunto-autorizado', vehiculoId] as const,
  perfiles: () => ['admin', 'perfiles'] as const,
  perfilesCount: () => ['admin', 'perfiles', 'count'] as const,
  perfilPorPersona: (personaId?: string) => ['admin', 'perfil-persona', personaId] as const,
  alertasRecientes: (limite: number) => ['admin', 'alertas', 'recientes', limite] as const,
  alertasCount: () => ['admin', 'alertas', 'count'] as const,
  notificaciones: () => ['admin', 'notificaciones'] as const,
  eventosRecientes: (limite: number) => ['admin', 'eventos', 'recientes', limite] as const,
  eventosCount: () => ['admin', 'eventos', 'count'] as const,
  eventoPorId: (id?: string) => ['admin', 'evento', id] as const,
  alertaPorId: (id?: string) => ['admin', 'alerta', id] as const,
  notificacionesTodas: (limite: number) => ['admin', 'notificaciones-todas', limite] as const,
  permanentesPorVehiculo: (vehiculoId?: string) => ['admin', 'permanentes', 'vehiculo', vehiculoId] as const,
  asignaciones: () => ['admin', 'asignaciones'] as const,
};

// ─── Auth — usuarios ────────────────────────────────────────────────────────

export const useUsuariosAdmin = (query: ListarUsuariosQuery = {}) =>
  useQuery({
    queryKey: adminKeys.usuarios(query),
    queryFn: () => adminService.listarUsuarios(query),
  });

export const useActivarUsuarioAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.activarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  });
};

export const useDesactivarUsuarioAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.desactivarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  });
};

export const useResetearPasswordUsuarioAdmin = () =>
  useMutation({
    mutationFn: (id: string) => adminService.resetearPasswordUsuario(id),
  });

export const useCrearUsuarioAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearUsuarioDto) => adminService.crearUsuario(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  });
};

// ─── Registry — personas y vehículos ────────────────────────────────────────

export const usePersonasAdmin = () =>
  useQuery({
    queryKey: adminKeys.personas(),
    queryFn: () => adminService.listarPersonas(),
  });

export const usePersonasCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.personasCount(),
    queryFn: () => adminService.contarPersonas().then((r) => r.count),
  });

export const usePersonasSinBiometria = () =>
  useQuery({
    queryKey: adminKeys.personasSinBiometria(),
    queryFn: () => adminService.listarPersonasSinBiometria(),
  });

export const useVehiculosAdmin = () =>
  useQuery({
    queryKey: adminKeys.vehiculos(),
    queryFn: () => adminService.listarVehiculos(),
  });

export const useVehiculosCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.vehiculosCount(),
    queryFn: () => adminService.contarVehiculos().then((r) => r.count),
  });

export const useBuscarVehiculoPorPlaca = (placa?: string) =>
  useQuery({
    queryKey: adminKeys.vehiculoPorPlaca(placa),
    queryFn: () => adminService.buscarVehiculoPorPlaca(placa as string),
    enabled: !!placa,
    retry: false,
  });

export const useVehiculoPorIdAdmin = (id?: string) =>
  useQuery({
    queryKey: adminKeys.vehiculoPorId(id),
    queryFn: () => registryService.buscarVehiculoPorId(id as string),
    enabled: !!id,
  });

export const useEliminarVehiculoAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehiculoId: string) => registryService.eliminarVehiculo(vehiculoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.vehiculos() });
      queryClient.invalidateQueries({ queryKey: adminKeys.vehiculosCount() });
    },
  });
};

// ─── Authorization — conteos y consultas institucionales ───────────────────

export const useGrupoFamiliarCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.grupoFamiliarCount(),
    queryFn: () => adminService.contarMiembrosGrupoFamiliar().then((r) => r.count),
  });

export const useTemporalesCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.temporalesCount(),
    queryFn: () => adminService.contarPermisosTemporales().then((r) => r.count),
  });

export const usePermisosProximosAExpirar = (dias = 7) =>
  useQuery({
    queryKey: adminKeys.temporalesProximosAExpirar(dias),
    queryFn: () => adminService.listarPermisosProximosAExpirar(dias),
  });

export const usePermisosPorVehiculoAdmin = (vehiculoId?: string) =>
  useQuery({
    queryKey: adminKeys.temporalesPorVehiculo(vehiculoId),
    queryFn: () => adminService.listarPermisosPorVehiculo(vehiculoId as string),
    enabled: !!vehiculoId,
  });

export const usePermisosPorPersonaAdmin = (personaId?: string) =>
  useQuery({
    queryKey: adminKeys.temporalesPorPersona(personaId),
    queryFn: () => adminService.listarPermisosPorPersona(personaId as string),
    enabled: !!personaId,
  });

export const useRevocarPermisoTemporalAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.revocarPermisoTemporal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'temporales'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'conjunto-autorizado'] });
    },
  });
};

export const usePasesCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.pasesCount(),
    queryFn: () => adminService.contarPasesActivos().then((r) => r.count),
  });

export const usePasesPorPlacaAdmin = (placa?: string) =>
  useQuery({
    queryKey: adminKeys.pasesPorPlaca(placa),
    queryFn: () => adminService.listarPasesPorPlaca(placa as string),
    enabled: !!placa,
  });

export const useRevocarPaseAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.revocarPase(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pases'] }),
  });
};

export const useConjuntoAutorizadoAdmin = (vehiculoId?: string) =>
  useQuery({
    queryKey: adminKeys.conjuntoAutorizado(vehiculoId),
    queryFn: () => adminService.obtenerConjuntoAutorizadoPorVehiculo(vehiculoId as string),
    enabled: !!vehiculoId,
  });

export const usePermanentesTodosAdmin = () =>
  useQuery({
    queryKey: ['admin', 'permanentes', 'todos'],
    queryFn: () => adminService.listarPermanentesTodos(),
  });

export const usePermanentesPorVehiculoAdmin = (vehiculoId?: string) =>
  useQuery({
    queryKey: adminKeys.permanentesPorVehiculo(vehiculoId),
    queryFn: () => adminService.listarPermanentesPorVehiculo(vehiculoId as string),
    enabled: !!vehiculoId,
  });

export const useRevocarAutorizacionPermanenteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.revocarAutorizacionPermanente(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'permanentes'] }),
  });
};

// ─── Registry — asignaciones de rol institucionales ─────────────────────────

export const useAsignacionesAdmin = () =>
  useQuery({
    queryKey: adminKeys.asignaciones(),
    queryFn: () => adminService.listarAsignaciones(),
  });

export const useCrearAsignacionRolAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearAsignacionRolDto) => adminService.crearAsignacionRol(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.asignaciones() }),
  });
};

export const useDesactivarAsignacionRolAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.desactivarAsignacionRol(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.asignaciones() }),
  });
};

// ─── Biometric ───────────────────────────────────────────────────────────────

export const usePerfilesBiometricosAdmin = () =>
  useQuery({
    queryKey: adminKeys.perfiles(),
    queryFn: () => adminService.listarPerfilesBiometricos(),
  });

export const usePerfilesCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.perfilesCount(),
    queryFn: () => adminService.contarPerfilesBiometricos().then((r) => r.count),
  });

export const usePerfilBiometricoPorPersonaAdmin = (personaId?: string) =>
  useQuery({
    queryKey: adminKeys.perfilPorPersona(personaId),
    queryFn: () => adminService.buscarPerfilBiometricoPorPersona(personaId as string),
    enabled: !!personaId,
  });

export const useRegistrarPerfilBiometricoAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (personaId: string) => adminService.registrarPerfilBiometrico(personaId),
    onSuccess: (_data, personaId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.perfilPorPersona(personaId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.perfiles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.perfilesCount() });
    },
  });
};

// ─── Alerting ────────────────────────────────────────────────────────────────

export const useAlertasRecientesAdmin = (limite = 10) =>
  useQuery({
    queryKey: adminKeys.alertasRecientes(limite),
    queryFn: () => adminService.listarAlertasRecientes(limite),
  });

export const useAlertasCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.alertasCount(),
    queryFn: () => adminService.contarAlertasNoAtendidas().then((r) => r.count),
  });

export const useAlertaPorIdAdmin = (id?: string) =>
  useQuery({
    queryKey: adminKeys.alertaPorId(id),
    queryFn: () => adminService.buscarAlertaPorId(id as string),
    enabled: !!id,
  });

export const useMarcarAlertaAtendidaAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.marcarAlertaAtendida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alertas'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerta'] });
    },
  });
};

export const useNotificacionesAdmin = () =>
  useQuery({
    queryKey: adminKeys.notificaciones(),
    queryFn: () => adminService.listarNotificaciones(),
  });

export const useNotificacionesTodasAdmin = (limite = 50) =>
  useQuery({
    queryKey: adminKeys.notificacionesTodas(limite),
    queryFn: () => adminService.listarTodasLasNotificaciones(limite),
  });

export const useMarcarNotificacionLeidaAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.marcarNotificacionLeida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notificaciones() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'notificaciones-todas'] });
    },
  });
};

// ─── Access Control ──────────────────────────────────────────────────────────

export const useEventosRecientesAdmin = (limite = 10) =>
  useQuery({
    queryKey: adminKeys.eventosRecientes(limite),
    queryFn: () => adminService.listarEventosRecientes(limite),
  });

export const useEventosCountAdmin = () =>
  useQuery({
    queryKey: adminKeys.eventosCount(),
    queryFn: () => adminService.contarEventosHoy().then((r) => r.count),
  });

export const useEventoPorIdAdmin = (id?: string) =>
  useQuery({
    queryKey: adminKeys.eventoPorId(id),
    queryFn: () => adminService.buscarEventoPorId(id as string),
    enabled: !!id,
  });

export const useRegistrarEventoManualAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RegistrarEventoManualDto) => adminService.registrarEventoManual(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'eventos'] }),
  });
};
