// src/services/guard.service.ts
// Cliente del dashboard GUARDIA — endpoints de access-control (BC Access Control).

import { apiGetData, apiPostData } from './api';
import { EventoAcceso, InvitadoActivo, RegistrarEventoManualDto } from './types/guard.types';

export const listarEventosRecientes = (limite = 20): Promise<EventoAcceso[]> =>
  apiGetData('/access-control/eventos/recientes', { limite });

export const listarEventosPorVehiculo = (vehiculoId: string, limite = 20): Promise<EventoAcceso[]> =>
  apiGetData(`/access-control/eventos/vehiculo/${vehiculoId}`, { limite });

export const contarEventosHoy = (): Promise<{ count: number }> =>
  apiGetData('/access-control/eventos/count');

export const registrarEventoManual = (dto: RegistrarEventoManualDto): Promise<EventoAcceso> =>
  apiPostData('/access-control/eventos/manual', dto);

export const listarInvitadosActivos = (): Promise<InvitadoActivo[]> =>
  apiGetData('/access-control/invitados-activos');

export const contarInvitadosActivos = (): Promise<{ count: number }> =>
  apiGetData('/access-control/invitados-activos/count');

export const validarPase = (codigo: string, placa: string): Promise<{ valido: boolean; motivo?: string }> =>
    apiPostData('/authorization/pases/validar', { codigo, placa });
