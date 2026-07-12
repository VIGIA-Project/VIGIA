// apps/frontend/src/hooks/useGuard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guardService } from '../services/guard.service';
import { RegistrarEventoDto } from '../services/types/guard.types';

// Access Control Queries
export const useEventosRecientes = (limite = 20) =>
    useQuery({
        queryKey: ['guard', 'eventos', 'recientes', limite],
        queryFn: () => guardService.getEventosRecientes(limite).then(r => r.data),
        refetchInterval: 10000,
    });

export const useEventosCountHoy = () =>
    useQuery({
        queryKey: ['guard', 'eventos', 'count'],
        queryFn: () => guardService.getEventosCountHoy().then(r => r.data.count),
        refetchInterval: 30000,
    });

export const useRegistrarEventoManual = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegistrarEventoDto) =>
            guardService.registrarEventoManual(data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guard', 'eventos'] });
        },
    });
};

// Authorization Queries
export const useConjuntoAutorizado = (vehiculoId: string | null) =>
    useQuery({
        queryKey: ['guard', 'conjunto-autorizado', vehiculoId],
        queryFn: () => guardService.getConjuntoAutorizado(vehiculoId!).then(r => r.data),
        enabled: !!vehiculoId,
    });

export const usePasesPorPlaca = (placa: string | null) =>
    useQuery({
        queryKey: ['guard', 'pases', 'placa', placa],
        queryFn: () => guardService.getPasesPorPlaca(placa!).then(r => r.data),
        enabled: !!placa && placa.length >= 6,
    });

export const useValidarPase = () =>
    useMutation({
        mutationFn: (data: { placa: string; codigo: string }) =>
            guardService.validarPase(data).then(r => r.data),
    });

export const useConsumirPase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => guardService.consumirPase(id).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guard', 'pases'] });
        },
    });
};

// Registry Queries
export const useBuscarVehiculoPorPlaca = (placa: string | null) =>
    useQuery({
        queryKey: ['guard', 'vehiculo', 'placa', placa],
        queryFn: () => guardService.buscarVehiculoPorPlaca(placa!).then(r => r.data),
        enabled: !!placa && placa.length >= 6,
    });

// Alerting Queries
export const useAlertasRecientes = (limite = 5) =>
    useQuery({
        queryKey: ['guard', 'alertas', 'recientes', limite],
        queryFn: () => guardService.getAlertasRecientes(limite).then(r => r.data),
        refetchInterval: 30000,
    });

export const useAlertasCount = () =>
    useQuery({
        queryKey: ['guard', 'alertas', 'count'],
        queryFn: () => guardService.getAlertasCount().then(r => r.data.count),
        refetchInterval: 30000,
    });