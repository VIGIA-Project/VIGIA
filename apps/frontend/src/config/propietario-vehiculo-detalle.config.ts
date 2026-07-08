// src/config/propietario-vehiculo-detalle.config.ts
// Mock data y contenido de "Detalle de vehículo" — Dashboard PROPIETARIO v1.2 §12

export type TabKey = 'resumen' | 'personas' | 'permisos' | 'pases' | 'actividad';

export const VEHICULO_DETALLE_TABS: { key: TabKey; label: string }[] = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'personas', label: 'Personas autorizadas' },
  { key: 'permisos', label: 'Permisos' },
  { key: 'pases', label: 'Pases rápidos' },
  { key: 'actividad', label: 'Actividad' },
];

export const VEHICULO_DETALLE_COPY = {
  backLabel: 'Mis vehículos',
  editCta: 'Editar vehículo',
  notFoundTitle: 'Vehículo no encontrado',
  notFoundDescription: 'No encontramos un vehículo con esa placa en tu cuenta.',
} as const;

// ─── Personas autorizadas ───────────────────────────────────────────────────
export type PersonaBiometria = 'COMPLETADA' | 'PENDIENTE';

export interface PersonaAutorizada {
  id: string;
  nombre: string;
  relacion: string;
  biometria: PersonaBiometria;
}

export const FAMILIA_MAX_MIEMBROS = 5;

export const MOCK_PERSONAS_AUTORIZADAS: PersonaAutorizada[] = [
  { id: 'per-1', nombre: 'Andrea Torres', relacion: 'Cónyuge', biometria: 'COMPLETADA' },
  { id: 'per-2', nombre: 'Luis Pérez', relacion: 'Hijo', biometria: 'PENDIENTE' },
  { id: 'per-3', nombre: 'Carlos Ruiz', relacion: 'Chofer', biometria: 'COMPLETADA' },
];

export const PERSONAS_TAB_COPY = {
  noticeText: 'Las personas de tu grupo familiar tienen acceso a todos tus vehículos activos. Para gestionar tu grupo, ve a Personas autorizadas.',
  noticeLink: 'Ir a Personas autorizadas →',
  accessText: 'Acceso a todos tus vehículos',
  bioCompleta: 'Biometría completada',
  bioPendiente: 'Biometría pendiente',
  emptyTitle: 'Aún no tienes personas en tu grupo familiar',
  emptyCta: 'Agregar persona →',
} as const;

// ─── Permisos temporales ─────────────────────────────────────────────────────
// Dominio: un permiso temporal solo tiene 3 estados posibles (no existe "Programado")
export type PermisoEstado = 'ACTIVO' | 'EXPIRADO' | 'REVOCADO';

export interface PermisoDetalle {
  id: string;
  persona: string;
  cedulaParcial: string;
  vigenciaLabel: string;
  estado: PermisoEstado;
  motivo: string;
}

// Motivos que puede seleccionar un PROPIETARIO al crear un permiso temporal.
// "Proveedor" / "invitado externo" corresponden al flujo del GUARDIA, no aplican aquí.
export const MOTIVOS_PROPIETARIO_OPTIONS = ['Visita familiar', 'Préstamo temporal', 'Trámite personal', 'Emergencia', 'Otro'] as const;

export const MOCK_PERMISOS_DETALLE: PermisoDetalle[] = [
  { id: 'perm-1', persona: 'María León', cedulaParcial: '••••4521', vigenciaLabel: '08 Jul 08:00 → 08 Jul 18:00', estado: 'ACTIVO', motivo: 'Visita familiar' },
  { id: 'perm-2', persona: 'Jorge Sánchez', cedulaParcial: '••••7734', vigenciaLabel: '05 Jul → 07 Jul', estado: 'EXPIRADO', motivo: 'Préstamo temporal' },
  { id: 'perm-3', persona: 'Ana Mora', cedulaParcial: '••••1190', vigenciaLabel: '01 Jul → 03 Jul', estado: 'EXPIRADO', motivo: 'Trámite personal' },
];

export const PERMISOS_TAB_COPY = {
  filters: { activos: 'Activos', expirados: 'Expirados', revocados: 'Revocados' },
  createCta: 'Crear permiso para este vehículo',
  viewDetail: 'Ver detalle',
  revoke: 'Revocar',
  empty: 'No hay permisos temporales para este vehículo.',
} as const;

// ─── Pases de Acceso Rápido ──────────────────────────────────────────────────
export type PaseEstado = 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';

export interface PaseDetalle {
  id: string;
  codigo: string | null;
  estado: PaseEstado;
  visitante: string;
  expiraLabel?: string;
  punto?: string;
  fecha?: string;
  usoUnico?: boolean;
}

export const MOCK_PASES_DETALLE: PaseDetalle[] = [
  { id: 'pase-1', codigo: 'A7K3M2', estado: 'ACTIVO', visitante: 'Andrea Torres', expiraLabel: '45 min', usoUnico: true },
  { id: 'pase-2', codigo: null, estado: 'CONSUMIDO', visitante: 'Carlos Ruiz', punto: 'Garita Norte', fecha: 'hoy 09:10' },
  { id: 'pase-3', codigo: null, estado: 'EXPIRADO', visitante: 'María León', fecha: 'ayer 14:00' },
];

export const PASES_TAB_COPY = {
  createCta: 'Generar pase rápido',
  copyCta: 'Copiar código',
  revokeCta: 'Revocar',
  activeLabel: (expira: string) => `Activo · Expira en ${expira}`,
  maskedCode: '••••••',
  emptyTitle: 'Los pases rápidos son para accesos puntuales e inmediatos',
  emptyCta: 'Generar pase rápido',
} as const;

// ─── Actividad ───────────────────────────────────────────────────────────────
export type EventoTipo = 'ENTRADA' | 'SALIDA';
export type EventoResultado = 'PERMITIDO' | 'DENEGADO' | 'REVISION';

export interface EventoDetalle {
  id: string;
  dia: string;
  hora: string;
  tipo: EventoTipo;
  resultado: EventoResultado;
  punto: string;
  persona: string;
  permisoUsado?: string;
  decision: string;
}

export const MOCK_EVENTOS_DETALLE: EventoDetalle[] = [
  { id: 'ev-1', dia: 'Hoy', hora: '08:05', tipo: 'ENTRADA', resultado: 'PERMITIDO', punto: 'Garita Norte', persona: 'Andrea Torres', permisoUsado: 'Acceso propietario', decision: 'Validación biométrica exitosa, acceso concedido automáticamente.' },
  { id: 'ev-2', dia: 'Hoy', hora: '07:42', tipo: 'ENTRADA', resultado: 'REVISION', punto: 'Garita Sur', persona: 'Luis Pérez', permisoUsado: 'Permiso temporal · Visita familiar', decision: 'Coincidencia biométrica parcial, se envió a revisión manual del guardia.' },
  { id: 'ev-3', dia: 'Ayer', hora: '18:10', tipo: 'SALIDA', resultado: 'PERMITIDO', punto: 'Garita Norte', persona: 'Propietario', decision: 'Salida registrada sin incidentes.' },
  { id: 'ev-4', dia: 'Ayer', hora: '13:22', tipo: 'ENTRADA', resultado: 'DENEGADO', punto: 'Garita Sur', persona: 'Persona no identificada', decision: 'No se encontró autorización vigente para este vehículo.' },
  { id: 'ev-5', dia: 'Ayer', hora: '09:05', tipo: 'ENTRADA', resultado: 'PERMITIDO', punto: 'Garita Norte', persona: 'Carlos Ruiz', permisoUsado: 'Acceso propietario', decision: 'Validación biométrica exitosa, acceso concedido automáticamente.' },
  { id: 'ev-6', dia: '05 Jul', hora: '17:50', tipo: 'SALIDA', resultado: 'PERMITIDO', punto: 'Garita Sur', persona: 'Andrea Torres', decision: 'Salida registrada sin incidentes.' },
  { id: 'ev-7', dia: '05 Jul', hora: '08:15', tipo: 'ENTRADA', resultado: 'PERMITIDO', punto: 'Garita Norte', persona: 'Andrea Torres', permisoUsado: 'Acceso propietario', decision: 'Validación biométrica exitosa, acceso concedido automáticamente.' },
];

export const ACTIVIDAD_TAB_COPY = {
  rangeLabel: 'Últimos 7 días',
  resultLabel: 'Todos',
  searchPlaceholder: 'Buscar por persona o punto...',
  empty: 'No hay eventos registrados para este vehículo.',
} as const;

export const RESULTADO_LABEL: Record<EventoResultado, string> = {
  PERMITIDO: 'Permitido',
  DENEGADO: 'Denegado',
  REVISION: 'Revisión manual',
};

export const RESULTADO_STYLES: Record<EventoResultado, { bg: string; color: string }> = {
  PERMITIDO: { bg: '#DCFCE7', color: '#166534' },
  DENEGADO: { bg: '#FEE2E2', color: '#991B1B' },
  REVISION: { bg: '#FEF3C7', color: '#92400E' },
};

// ─── Resumen ─────────────────────────────────────────────────────────────────
export const RESUMEN_TAB_COPY = {
  kpiEstado: 'Estado operativo',
  kpiPermisos: 'Permisos vigentes',
  kpiPersonas: 'Personas autorizadas',
  kpiUltimoEvento: 'Último evento',
  ultimoEventoLabel: 'Acceso permitido · Garita Norte · hoy 08:05',
  accionesTitle: 'Acciones sugeridas',
  accionCrearPermiso: 'Crear permiso temporal',
  accionGenerarPase: 'Generar pase rápido',
  accionVerPersonas: 'Ver personas autorizadas',
  actividadTitle: 'Actividad reciente',
  verHistorialCompleto: 'Ver historial completo →',
} as const;

export const ESTADO_VEHICULO_STYLES = {
  ACTIVO: { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
  INACTIVO: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
} as const;
