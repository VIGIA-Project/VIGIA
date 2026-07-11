// src/hooks/useNotifications.ts
// Hooks TanStack Query para el bell de notificaciones — compartido entre OWNER, GUARD y ADMIN.
// El backend filtra /alerting/notificaciones por el usuario autenticado (vía JWT), no requiere userId.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetData, apiPatchData } from '../services/api';
import { Notificacion } from '../services/types/admin.types';

export const notificationKeys = {
  notificaciones: () => ['notificaciones'] as const,
  alertasCount: () => ['alertas', 'count'] as const,
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
