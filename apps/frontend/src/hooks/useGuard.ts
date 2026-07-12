// src/hooks/useGuard.ts
// Hooks TanStack Query para el dashboard GUARDIA.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as guardService from '../services/guard.service';
import { RegistrarEventoManualDto } from '../services/types/guard.types';

export const guardKeys = {
  eventosRecientes: (limite: number) => ['guard', 'eventos', 'recientes', limite] as const,
  eventosCountHoy: () => ['guard', 'eventos', 'count'] as const,
  invitadosActivos: () => ['guard', 'invitados-activos'] as const,
  invitadosActivosCount: () => ['guard', 'invitados-activos', 'count'] as const,
};

export const useEventosRecientes = (limite = 20) =>
  useQuery({
    queryKey: guardKeys.eventosRecientes(limite),
    queryFn: () => guardService.listarEventosRecientes(limite),
    refetchInterval: 15000,
  });

export const useEventosCountHoy = () =>
  useQuery({
    queryKey: guardKeys.eventosCountHoy(),
    queryFn: () => guardService.contarEventosHoy().then((r) => r.count),
    refetchInterval: 30000,
  });

export const useInvitadosActivos = () =>
  useQuery({
    queryKey: guardKeys.invitadosActivos(),
    queryFn: () => guardService.listarInvitadosActivos(),
    refetchInterval: 30000,
  });

export const useInvitadosActivosCount = () =>
  useQuery({
    queryKey: guardKeys.invitadosActivosCount(),
    queryFn: () => guardService.contarInvitadosActivos().then((r) => r.count),
    refetchInterval: 30000,
  });

export const useRegistrarEventoManual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RegistrarEventoManualDto) => guardService.registrarEventoManual(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guard', 'eventos'] });
      queryClient.invalidateQueries({ queryKey: ['guard', 'invitados-activos'] });
    },
  });
};
