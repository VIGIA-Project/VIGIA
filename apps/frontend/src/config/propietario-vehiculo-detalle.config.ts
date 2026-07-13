// src/config/propietario-vehiculo-detalle.config.ts
// Contenido y "view models" de "Detalle de vehículo" — Dashboard PROPIETARIO v1.2 §12.
// Los datos reales vienen de Authorization/Access Control/Registry (ver mapXAViewModel).

import { format } from 'date-fns';
import { enmascararCedula } from './propietario-personas.config';
import { MiembroGrupoFamiliar, PermisoTemporal as PermisoTemporalApi, PaseAccesoRapido, EstadoAutorizacion } from '../services/types/authorization.types';
import { Persona } from '../services/types/registry.types';
import { EventoAcceso } from '../services/types/guard.types';

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

/** Combina un MiembroGrupoFamiliar (Authorization) con su Persona (Registry). */
export const mapMiembroAPersonaAutorizada = (m: MiembroGrupoFamiliar, persona?: Persona): PersonaAutorizada => ({
  id: m.id,
  nombre: persona?.nombreCompleto ?? 'Cargando…',
  relacion: m.relacion,
  biometria: persona?.estadoBiometrico === 'COMPLETO' ? 'COMPLETADA' : 'PENDIENTE',
});

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

const PERMISO_ESTADO_MAP: Record<EstadoAutorizacion, PermisoEstado> = {
  ACTIVA: 'ACTIVO',
  EXPIRADA: 'EXPIRADO',
  REVOCADA: 'REVOCADO',
  INACTIVA: 'EXPIRADO',
};

/** Combina un PermisoTemporal (Authorization) con su Persona (Registry). */
export const mapPermisoAPermisoDetalle = (p: PermisoTemporalApi, persona?: Persona): PermisoDetalle => ({
  id: p.id,
  persona: persona?.nombreCompleto ?? 'Cargando…',
  cedulaParcial: persona ? enmascararCedula(persona.identificacionNumero) : '—',
  vigenciaLabel: `${format(new Date(p.vigenciaInicio), 'dd MMM HH:mm')} → ${format(new Date(p.vigenciaFin), 'dd MMM HH:mm')}`,
  estado: PERMISO_ESTADO_MAP[p.estado],
  motivo: p.motivo,
});

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

/** Combina un PaseAccesoRapido (Authorization) — el código en texto plano solo existe justo tras generarlo. */
export const mapPaseAPaseDetalle = (p: PaseAccesoRapido): PaseDetalle => {
  const minutosRestantes = Math.max(0, Math.round((new Date(p.vigenciaFin).getTime() - Date.now()) / 60000));
  return {
    id: p.id,
    codigo: null,
    estado: p.estado,
    visitante: p.nombreVisitante,
    expiraLabel: p.estado === 'ACTIVO' ? `${minutosRestantes} min` : undefined,
    fecha: p.fechaConsumo
      ? format(new Date(p.fechaConsumo), 'dd MMM HH:mm')
      : p.estado !== 'ACTIVO'
        ? format(new Date(p.vigenciaFin), 'dd MMM HH:mm')
        : undefined,
    usoUnico: true,
  };
};

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

const diaLabel = (iso: string): string => {
  const fecha = new Date(iso);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const esMismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (esMismoDia(fecha, hoy)) return 'Hoy';
  if (esMismoDia(fecha, ayer)) return 'Ayer';
  return format(fecha, 'dd MMM');
};

const ORIGEN_LABEL: Record<string, string> = {
  AUTOMATICA: 'Automático',
  MANUAL: 'Registro manual (garita)',
  CONTINGENCIA: 'Contingencia',
  INVITADO: 'Invitado',
};

/** Combina un EventoAcceso (Access Control). El dominio no registra un nombre de
 * persona por evento (solo `personaDetectadaId`), así que se muestra el motivo real. */
export const mapEventoAEventoDetalle = (e: EventoAcceso): EventoDetalle => ({
  id: e.eventoAccesoId,
  dia: diaLabel(e.capturadoEn),
  hora: format(new Date(e.capturadoEn), 'HH:mm'),
  tipo: e.tipoMovimiento,
  resultado: e.decisionOperativa === 'DENIED' ? 'DENEGADO' : e.decisionOperativa === 'PENDING_VERIFY' ? 'REVISION' : 'PERMITIDO',
  punto: ORIGEN_LABEL[e.origenResolucion] ?? e.origenResolucion,
  persona: e.motivoDetalle || e.motivoCodigo || '—',
  permisoUsado: e.motivoCodigo ?? undefined,
  decision: e.motivoDetalle || e.motivoCodigo || 'Sin detalle adicional.',
});

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
