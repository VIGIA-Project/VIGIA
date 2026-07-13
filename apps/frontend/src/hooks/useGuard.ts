// src/hooks/useGuard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as guardService from '../services/guard.service';
import { RegistrarEventoManualDto } from '../services/types/guard.types';

export const guardKeys = {
    all: ['guard'] as const,
    eventosRecientes: (limite: number) => [...guardKeys.all, 'eventos', 'recientes', limite] as const,
    eventosCountHoy: () => [...guardKeys.all, 'eventos', 'count'] as const,
    invitadosActivos: () => [...guardKeys.all, 'invitados-activos'] as const,
    invitadosActivosCount: () => [...guardKeys.all, 'invitados-activos', 'count'] as const,
};

export const useEventosRecientes = (limite = 20) =>
    useQuery({
        queryKey: guardKeys.eventosRecientes(limite),
        queryFn: () => guardService.listarEventosRecientes(limite),
        // Bajamos a 5 segundos para tiempo real crítico en garita
        refetchInterval: 5000,
        // Mantiene la data fresca incluso si el tab está en background
        refetchIntervalInBackground: true,
    });

export const useEventosPorVehiculo = (vehiculoId?: string, limite = 20) =>
    useQuery({
        queryKey: [...guardKeys.all, 'eventos', 'vehiculo', vehiculoId, limite] as const,
        queryFn: () => guardService.listarEventosPorVehiculo(vehiculoId as string, limite),
        enabled: !!vehiculoId,
    });

export const useEventosCountHoy = () =>
    useQuery({
        queryKey: guardKeys.eventosCountHoy(),
        queryFn: () => guardService.contarEventosHoy().then((r) => r.count),
        refetchInterval: 15000,
    });

export const useInvitadosActivos = () =>
    useQuery({
        queryKey: guardKeys.invitadosActivos(),
        queryFn: () => guardService.listarInvitadosActivos(),
        refetchInterval: 15000,
    });

export const useInvitadosActivosCount = () =>
    useQuery({
        queryKey: guardKeys.invitadosActivosCount(),
        queryFn: () => guardService.contarInvitadosActivos().then((r) => r.count),
        refetchInterval: 15000,
    });
export const useValidarPase = () =>
    useMutation({
        mutationFn: ({ codigo, placa }: { codigo: string; placa: string }) =>
            guardService.validarPase(codigo, placa),
    });

export const useRegistrarEventoManual = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: RegistrarEventoManualDto) => guardService.registrarEventoManual(dto),
        onSuccess: () => {
            // Invalidamos todo el bloque 'guard' para asegurar consistencia total
            queryClient.invalidateQueries({ queryKey: guardKeys.all });
        },
    });
};