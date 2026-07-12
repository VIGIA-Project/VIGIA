// src/services/types/guard.types.ts
// Tipos que reflejan las respuestas reales de /access-control (ver
// apps/backend/src/modules/access-control — enums de dominio TipoMovimiento,
// DecisionOperativa y OrigenResolucion).

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';
export type DecisionOperativa = 'SUCCESSFUL' | 'PENDING_VERIFY' | 'DENIED';
export type OrigenResolucion = 'AUTOMATICA' | 'MANUAL' | 'CONTINGENCIA' | 'INVITADO';

export interface EventoAcceso {
  eventoAccesoId: string;
  vehiculoId: string | null;
  personaDetectadaId: string | null;
  placaObservada: string;
  tipoMovimiento: TipoMovimiento;
  decisionOperativa: DecisionOperativa;
  motivoCodigo: string | null;
  motivoDetalle: string | null;
  origenResolucion: OrigenResolucion;
  capturadoEn: string;
  resueltoEn: string | null;
}

export interface InvitadoActivo {
  eventoId: string;
  placaObservada: string;
  motivoDetalle: string;
  capturadoEn: string;
  duracionAutorizadaMin: number | null;
  estaExcedido: boolean;
}

export interface RegistrarEventoManualDto {
  placaObservada: string;
  tipoMovimiento: TipoMovimiento;
  decisionOperativa: 'SUCCESSFUL' | 'DENIED';
  motivoCodigo: string;
  motivoDetalle?: string;
  vehiculoId?: string;
  personaId?: string;
  /** Solo aplica cuando motivoCodigo = 'CONTINGENCIA' */
  duracionAutorizadaMin?: number;
}
