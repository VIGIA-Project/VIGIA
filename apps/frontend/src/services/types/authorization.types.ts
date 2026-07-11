// src/services/types/authorization.types.ts
// Tipos que reflejan el toJSON() de los Aggregate Roots del BC Authorization
// (ver apps/backend/src/modules/authorization/domain/entities/*.entity.ts)

export type TipoAutorizacion = 'PERMANENTE' | 'TEMPORAL';

export type EstadoAutorizacion = 'ACTIVA' | 'INACTIVA' | 'REVOCADA' | 'EXPIRADA';

export type EstadoPase = 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';

export interface MiembroGrupoFamiliar {
  id: string;
  personaId: string;
  propietarioId: string;
  estado: EstadoAutorizacion;
  relacion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PermisoTemporal {
  id: string;
  personaId: string;
  vehiculoId: string;
  propietarioId: string;
  tipo: TipoAutorizacion;
  estado: EstadoAutorizacion;
  vigenciaInicio: string;
  vigenciaFin: string;
  motivo: string;
  fechaCreacion: string;
  fechaRevocacion?: string;
}

export interface PaseAccesoRapido {
  id: string;
  vehiculoId: string;
  propietarioId: string;
  placa: string;
  estado: EstadoPase;
  vigenciaInicio: string;
  vigenciaFin: string;
  nombreVisitante: string;
  cedulaVisitante: string;
  motivo: string;
  fechaCreacion: string;
  fechaConsumo?: string;
  eventoConsumoId?: string;
}

export interface GenerarPaseResult {
  pase: PaseAccesoRapido;
  codigoPlano: string;
}

export interface MiembroConjuntoAutorizado {
  personaId: string;
  tipo: TipoAutorizacion;
  vigenciaFin?: string;
}

export interface ConjuntoAutorizado {
  vehiculoId: string;
  propietarioId: string;
  autorizados: MiembroConjuntoAutorizado[];
}

export interface ResultadoValidacionPase {
  valido: boolean;
  paseId?: string;
  motivo: string;
}

// ─── DTOs de entrada ────────────────────────────────────────────────────

export interface CrearMiembroGrupoFamiliarDto {
  personaId: string;
  relacion: string;
}

export interface CrearPermisoTemporalDto {
  personaId: string;
  vehiculoId: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  motivo: string;
}

export interface CrearPaseRapidoDto {
  vehiculoId: string;
  placa: string;
  nombreVisitante: string;
  cedulaVisitante: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  motivo: string;
}

export interface ValidarPaseDto {
  codigo: string;
  placa: string;
}
