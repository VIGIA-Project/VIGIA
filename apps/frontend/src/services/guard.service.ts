
import api from './api';
import {
    EventoAcceso,
    ConjuntoAutorizado,
    PaseActivo,
    ValidarPaseResponse,
    RegistrarEventoDto,
    Alerta,
    VehiculoResponse
} from './types/guard.types';

export const guardService = {
    // Access Control
    getEventosRecientes: (limite = 20) =>
        api.get<EventoAcceso[]>(`/access-control/eventos/recientes?limite=${limite}`),

    getEventosCountHoy: () =>
        api.get<{ count: number }>('/access-control/eventos/count'),

    registrarEventoManual: (data: RegistrarEventoDto) =>
        api.post<EventoAcceso>('/access-control/eventos/manual', data),

    // Authorization queries
    getConjuntoAutorizado: (vehiculoId: string) =>
        api.get<ConjuntoAutorizado>(`/authorization/conjunto-autorizado/vehiculo/${vehiculoId}`),

    getPasesPorPlaca: (placa: string) =>
        api.get<PaseActivo[]>(`/authorization/pases/placa/${placa}`),

    validarPase: (data: { placa: string; codigo: string }) =>
        api.post<ValidarPaseResponse>('/authorization/pases/validar', data),

    consumirPase: (id: string) =>
        api.patch<{ success: boolean; mensaje: string }>(`/authorization/pases/${id}/consumir`),

    // Registry queries
    buscarVehiculoPorPlaca: (placa: string) =>
        api.get<VehiculoResponse>(`/registry/vehiculos/placa/${placa}`),

    // Alerting
    getAlertasRecientes: (limite = 5) =>
        api.get<Alerta[]>(`/alerting/alertas/recientes?limite=${limite}`),

    getAlertasCount: () =>
        api.get<{ count: number }>('/alerting/alertas/count'),
};