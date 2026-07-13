// src/services/types/admin.types.ts
// Tipos que reflejan las respuestas de los endpoints consumidos por el dashboard ADMIN.

export type UserRole = 'ADMIN' | 'GUARD' | 'OWNER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_PASSWORD_CHANGE';

export interface UsuarioAdmin {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean;
  personaId?: string;
  biometricRegistered: boolean;
  vehicleRegistered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListarUsuariosQuery {
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface UsuariosPaginados {
  data: UsuarioAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResetPasswordResult {
  temporaryPassword: string;
}

export interface CrearUsuarioDto {
  email: string;
  role: UserRole;
  temporaryPassword: string;
  personaId?: string;
}

export type EstadoDisponibilidadBiometrico = 'DISPONIBLE' | 'NO_DISPONIBLE' | 'PENDIENTE_CAPTURA';

export interface PerfilBiometrico {
  perfilBiometricoId: string;
  personaId: string;
  personaNombre?: string;
  estadoDisponibilidad: EstadoDisponibilidadBiometrico;
  ultimaActualizacionBiometrica?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type SeveridadAlerta = 'ALTA' | 'MEDIA' | 'INFORMATIVA';
export type EstadoAtencionAlerta = 'GENERADA' | 'ENTREGADA' | 'ATENDIDA';

export interface Alerta {
  alertaId: string;
  causaOrigen: string;
  referenciaOrigenId: string;
  vehiculoId?: string;
  severidad: SeveridadAlerta;
  estadoAtencion: EstadoAtencionAlerta;
  mensajeResumen: string;
  generadaEn: string;
  atendidaEn?: string;
}

export type EstadoEntregaNotificacion = 'PENDIENTE' | 'ENVIADA' | 'FALLIDA';

export interface Notificacion {
  notificacionId: string;
  alertaId: string;
  destinatarioPersonaId: string;
  canal: string;
  titulo: string;
  estadoEntrega: EstadoEntregaNotificacion;
  contenidoResumen: string;
  leida: boolean;
  leidaEn?: string;
  enviadaEn?: string;
}

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';
export type DecisionOperativa = 'SUCCESSFUL' | 'PENDING_VERIFY' | 'DENIED';
export type OrigenResolucion = 'AUTOMATICA' | 'MANUAL' | 'CONTINGENCIA' | 'INVITADO';

export interface EventoAcceso {
  eventoAccesoId: string;
  vehiculoId?: string;
  personaDetectadaId?: string;
  placaObservada: string;
  tipoMovimiento: TipoMovimiento;
  decisionOperativa: DecisionOperativa;
  motivoCodigo: string;
  motivoDetalle?: string;
  origenResolucion: OrigenResolucion;
  capturadoEn: string;
  resueltoEn?: string;
}

export interface RegistrarEventoManualDto {
  placaObservada: string;
  tipoMovimiento: TipoMovimiento;
  decisionOperativa: 'SUCCESSFUL' | 'DENIED';
  motivoCodigo: string;
  motivoDetalle?: string;
  vehiculoId?: string;
  personaId?: string;
}
