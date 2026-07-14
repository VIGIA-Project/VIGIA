// src/hooks/useNotifications.ts
// Hooks TanStack Query para el bell de notificaciones — compartido entre OWNER, GUARD y ADMIN.
// El backend filtra /alerting/notificaciones por el usuario autenticado (vía JWT), no requiere userId.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetData, apiPatchData } from '../services/api';
import { Alerta, Notificacion } from '../services/types/admin.types';

export const notificationKeys = {
  notificaciones: () => ['notificaciones'] as const,
  alertasCount: () => ['alertas', 'count'] as const,
  alertasRecientes: (limite: number) => ['alertas', 'recientes', limite] as const,
};

export const useNotificaciones = () =>
  useQuery({
    queryKey: notificationKeys.notificaciones(),
    queryFn: () => apiGetData<Notificacion[]>('/alerting/notificaciones'),
  });

export const useAlertasNoAtendidasCount = () =>
  useQuery({
    queryKey: notificationKeys.alertasCount(),
    queryFn: () => apiGetData<{ count: number }>('/alerting/alertas/count').then((r) => r.count),
  });

export const useAlertasRecientes = (limite = 20) =>
  useQuery({
    queryKey: notificationKeys.alertasRecientes(limite),
    queryFn: () => apiGetData<Alerta[]>('/alerting/alertas/recientes', { limite }),
    refetchInterval: 15000,
  });

export const useMarcarAlertaAtendida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPatchData<Alerta>(`/alerting/alertas/${id}/atender`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useMarcarNotificacionLeida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPatchData<Notificacion>(`/alerting/notificaciones/${id}/leer`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.notificaciones() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.alertasCount() });
    },
  });
};
