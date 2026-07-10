// src/hooks/useAuthorization.ts
// Hooks TanStack Query para el BC Authorization.

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as authorizationService from '../services/authorization.service';
import {
  AutorizacionPermanente,
  PermisoTemporal,
  PaseAccesoRapido,
  ConjuntoAutorizado,
  CrearAutorizacionPermanenteDto,
  CrearPermisoTemporalDto,
  CrearPaseRapidoDto,
} from '../services/types/authorization.types';

export const authorizationKeys = {
  all: ['authorization'] as const,
  permanentesPorVehiculo: (vehiculoId?: string) => ['authorization', 'permanentes', vehiculoId] as const,
  permanentesActivasPorVehiculo: (vehiculoId?: string) =>
    ['authorization', 'permanentes-activas', vehiculoId] as const,
  temporalesPorVehiculo: (vehiculoId?: string) => ['authorization', 'temporales-vehiculo', vehiculoId] as const,
  temporalesPorPersona: (personaId?: string) => ['authorization', 'temporales-persona', personaId] as const,
  misPases: () => ['authorization', 'mis-pases'] as const,
  conjuntoAutorizado: (vehiculoId?: string) => ['authorization', 'conjunto-autorizado', vehiculoId] as const,
};

type QueryOpts<T> = Pick<UseQueryOptions<T>, 'enabled'>;

// ─── Autorizaciones permanentes ──────────────────────────────────────────

export const useAutorizacionesPorVehiculo = (vehiculoId?: string, opts?: QueryOpts<AutorizacionPermanente[]>) =>
  useQuery({
    queryKey: authorizationKeys.permanentesActivasPorVehiculo(vehiculoId),
    queryFn: () => authorizationService.listarActivasPorVehiculo(vehiculoId as string),
    enabled: !!vehiculoId && (opts?.enabled ?? true),
  });

export const useCrearAutorizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearAutorizacionPermanenteDto) => authorizationService.crearAutorizacionPermanente(dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.permanentesActivasPorVehiculo(variables.vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.permanentesPorVehiculo(variables.vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.conjuntoAutorizado(variables.vehiculoId) });
    },
  });
};

export const useRevocarAutorizacion = (vehiculoId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authorizationService.revocarAutorizacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.permanentesActivasPorVehiculo(vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.permanentesPorVehiculo(vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.conjuntoAutorizado(vehiculoId) });
    },
  });
};

// ─── Permisos temporales ──────────────────────────────────────────────────

export const usePermisosVigentesPorVehiculo = (vehiculoId?: string, opts?: QueryOpts<PermisoTemporal[]>) =>
  useQuery({
    queryKey: authorizationKeys.temporalesPorVehiculo(vehiculoId),
    queryFn: () => authorizationService.listarVigentesPorVehiculo(vehiculoId as string),
    enabled: !!vehiculoId && (opts?.enabled ?? true),
  });

export const useCrearPermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearPermisoTemporalDto) => authorizationService.crearPermisoTemporal(dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.temporalesPorVehiculo(variables.vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.conjuntoAutorizado(variables.vehiculoId) });
    },
  });
};

export const useRevocarPermiso = (vehiculoId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authorizationService.revocarPermiso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.temporalesPorVehiculo(vehiculoId) });
      queryClient.invalidateQueries({ queryKey: authorizationKeys.conjuntoAutorizado(vehiculoId) });
    },
  });
};

// ─── Pases de acceso rápido ────────────────────────────────────────────────

export const useMisPases = (opts?: QueryOpts<PaseAccesoRapido[]>) =>
  useQuery({
    queryKey: authorizationKeys.misPases(),
    queryFn: () => authorizationService.listarMisPases(),
    enabled: opts?.enabled ?? true,
  });

export const useGenerarPase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearPaseRapidoDto) => authorizationService.generarPase(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.misPases() });
    },
  });
};

export const useRevocarPase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authorizationService.revocarPase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authorizationKeys.misPases() });
    },
  });
};

// ─── Conjunto autorizado ────────────────────────────────────────────────────

export const useConjuntoAutorizado = (vehiculoId?: string, opts?: QueryOpts<ConjuntoAutorizado>) =>
  useQuery({
    queryKey: authorizationKeys.conjuntoAutorizado(vehiculoId),
    queryFn: () => authorizationService.obtenerConjuntoAutorizado(vehiculoId as string),
    enabled: !!vehiculoId && (opts?.enabled ?? true),
  });
