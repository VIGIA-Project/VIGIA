// src/hooks/useRegistry.ts
// Hooks TanStack Query para el BC Registry — solo lo que necesita hoy el
// dashboard de Propietario (personas y vehículos propios).

import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import * as registryService from '../services/registry.service';
import { CrearPersonaDto, Persona } from '../services/types/registry.types';
import { useAuth } from '../context/AuthContext';

export const registryKeys = {
  persona: (personaId?: string) => ['registry', 'persona', personaId] as const,
  personas: (personaIds: string[]) => ['registry', 'personas', ...personaIds] as const,
  vehiculo: (vehiculoId?: string) => ['registry', 'vehiculo', vehiculoId] as const,
  vehiculosDelPropietario: (propietarioPersonaId?: string) =>
    ['registry', 'vehiculos-propietario', propietarioPersonaId] as const,
};

export const useVehiculosDelPropietario = (propietarioPersonaId?: string) =>
  useQuery({
    queryKey: registryKeys.vehiculosDelPropietario(propietarioPersonaId),
    queryFn: () => registryService.listarVehiculosDelPropietario(propietarioPersonaId as string),
    enabled: !!propietarioPersonaId,
  });

export const usePersona = (personaId?: string) =>
  useQuery({
    queryKey: registryKeys.persona(personaId),
    queryFn: () => registryService.buscarPersonaPorId(personaId as string),
    enabled: !!personaId,
  });

/**
 * Resuelve varias personas por id en paralelo (usado para enriquecer listados
 * de autorizaciones/permisos que solo traen `personaId`). Los resultados
 * ausentes o en error se omiten silenciosamente — la UI debe tolerar
 * `persona: undefined` y mostrar un fallback.
 */
export const usePersonasDelPropietario = (personaIds: string[]) => {
  const uniqueIds = Array.from(new Set(personaIds.filter(Boolean)));
  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: registryKeys.persona(id),
      queryFn: () => registryService.buscarPersonaPorId(id),
      staleTime: 60_000,
    })),
  });

  const personasById = new Map<string, Persona>();
  results.forEach((r, i) => {
    if (r.data) personasById.set(uniqueIds[i], r.data);
  });

  return {
    personasById,
    isLoading: results.some((r) => r.isLoading),
  };
};

export const useCrearPersona = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearPersonaDto) => registryService.crearPersona(dto),
    onSuccess: (persona) => {
      queryClient.setQueryData(registryKeys.persona(persona.personaId), persona);
    },
  });
};

export const useMarcarEnrollmentCompleto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (personaId: string) => registryService.marcarEnrollmentCompleto(personaId),
    onSuccess: (persona) => {
      queryClient.setQueryData(registryKeys.persona(persona.personaId), persona);
    },
  });
};

/**
 * Vehículo principal del propietario autenticado — hoy el dashboard opera
 * sobre un único vehículo (el sembrado por el seed de desarrollo).
 *
 * `perfilIncompleto` distingue el caso en que el usuario aún no tiene
 * `personaId` vinculado (JWT sin Persona asociada en Registry) del caso de
 * "no tiene vehículos" — ambos lucían igual antes de este fix y mostraban
 * el mensaje engañoso "Necesitas registrar un vehículo" incluso cuando el
 * vehículo sí existía pero no podía resolverse por falta de personaId.
 */
export const usePropietarioVehiculo = () => {
  const { user } = useAuth();
  const perfilIncompleto = !user?.personaId;
  const query = useVehiculosDelPropietario(user?.personaId);
  return {
    vehiculo: query.data?.[0],
    isLoading: !perfilIncompleto && query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    perfilIncompleto,
  };
};
