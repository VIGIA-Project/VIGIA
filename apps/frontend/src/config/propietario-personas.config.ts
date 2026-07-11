// src/config/propietario-personas.config.ts
// Contenido y tipos de "Personas autorizadas" — Dashboard PROPIETARIO v1.2 §13-14
// Los datos ahora vienen de Authorization + Registry (ver mapAutorizacionAPersona) —
// este archivo conserva el "view model" que ya consumen PersonaCard/PersonasGrid/etc.

import { format } from 'date-fns';
import { AutorizacionPermanente } from '../services/types/authorization.types';
import { Persona } from '../services/types/registry.types';

export type PersonaTipo = 'familia' | 'frecuente';
export type PersonaBiometria = 'COMPLETADA' | 'PENDIENTE';
export type PersonaEstado = 'ACTIVA' | 'REVOCADA';

export interface PersonaAutorizada {
  /** id de la AutorizacionPermanente — usado para revocar */
  id: string;
  /** id de la Persona en Registry — usado para resolver biometría/navegación secundaria */
  personaId: string;
  nombre: string;
  cedula: string;
  relacion: string;
  tipo: PersonaTipo;
  biometria: PersonaBiometria;
  estado: PersonaEstado;
  telefono?: string;
  autorizadoDesde: string;
}

/** Enmascara una cédula real al mismo formato que usaban los mocks (17XXXXXX45). */
export const enmascararCedula = (numero: string): string => {
  if (numero.length <= 4) return numero;
  return `${numero.slice(0, 2)}${'X'.repeat(numero.length - 4)}${numero.slice(-2)}`;
};

/** Combina una AutorizacionPermanente (Authorization) con su Persona (Registry). */
export const mapAutorizacionAPersona = (
  autorizacion: AutorizacionPermanente,
  persona?: Persona
): PersonaAutorizada => ({
  id: autorizacion.id,
  personaId: autorizacion.personaId,
  nombre: persona?.nombreCompleto ?? 'Cargando…',
  cedula: persona ? enmascararCedula(persona.identificacionNumero) : '—',
  relacion: autorizacion.relacion,
  tipo: tipoFromRelacion(autorizacion.relacion),
  biometria: persona?.estadoBiometrico === 'COMPLETO' ? 'COMPLETADA' : 'PENDIENTE',
  estado: autorizacion.estado === 'ACTIVA' ? 'ACTIVA' : 'REVOCADA',
  telefono: persona?.telefonoContacto,
  autorizadoDesde: format(new Date(autorizacion.fechaCreacion), "dd MMM yyyy"),
});

export const FAMILIA_MAX_MIEMBROS = 5;

// Los grupos "familia" y "frecuente" derivan de la relación seleccionada — no hay un
// selector de tipo separado en el formulario (§13, sin selector de vehículos ni de tipo).
export const RELACION_OPTIONS = ['Cónyuge', 'Hijo/a', 'Familiar', 'Chofer', 'Visitante frecuente', 'Otro'] as const;
const RELACIONES_FRECUENTES = new Set(['Chofer', 'Visitante frecuente']);
export const tipoFromRelacion = (relacion: string): PersonaTipo => (RELACIONES_FRECUENTES.has(relacion) ? 'frecuente' : 'familia');

export const PERSONAS_HEADER_COPY = {
  title: 'Personas autorizadas',
  subtitle: (n: number) => `Grupo familiar del propietario · ${n}/${FAMILIA_MAX_MIEMBROS} cupos usados`,
  addCta: 'Agregar persona',
  limitHelper: 'Has alcanzado el límite de personas autorizadas para tu grupo familiar',
  requiresVehicleTitle: 'Necesitas al menos un vehículo registrado',
  requiresVehicleDescription: 'Registra tu primer vehículo para poder autorizar personas.',
  requiresVehicleCta: 'Registrar vehículo',
} as const;

export const PERSONAS_FILTERS_COPY = {
  todas: 'Todas',
  familia: 'Familia',
  frecuentes: 'Frecuentes',
  pendiente: 'Biometría pendiente',
  searchPlaceholder: 'Buscar persona...',
} as const;

export const RESUMEN_CONFIANZA_COPY = {
  title: 'Resumen de confianza',
  activas: (n: number) => (n === 1 ? '1 persona activa' : `${n} personas activas`),
  pendientes: (n: number) => `${n} con biometría pendiente`,
  revocadas: (n: number) => `${n} autorizaciones revocadas`,
} as const;

export const REGLAS_VISIBLES_COPY = {
  title: 'Reglas visibles',
  bullets: ['Máximo 5 personas por propietario', 'Acceso a todos tus vehículos activos', 'Biometría solo presencial'],
} as const;

export const PERSONA_CARD_COPY = {
  bioCompleta: 'Biometría completada',
  bioPendiente: 'Biometría pendiente',
  revocada: 'Revocada',
  accessText: 'Acceso a todos tus vehículos',
  pendingMicrocopy: 'Registra su biometría cuando esté presente',
  viewDetail: 'Ver detalle',
  registerBio: 'Registrar biometría',
  revoke: 'Revocar',
} as const;

export const GRUPO_FAMILIAR_TITLE = 'Grupo familiar';
export const PERSONAS_FRECUENTES_TITLE = 'Personas frecuentes';

export const PERSONAS_EMPTY_COPY = {
  title: 'Aún no tienes personas autorizadas',
  description: 'Autoriza hasta 5 personas para que accedan con todos tus vehículos registrados.',
  cta: 'Agregar persona',
} as const;

export const PERSONAS_EMPTY_SEARCH = 'No se encontraron personas con ese criterio.';

export const ADD_PERSONA_DRAWER_COPY = {
  title: 'Agregar persona autorizada',
  subtitle: 'Permite que una persona use tus vehículos',
  sectionDatos: 'Datos de la persona',
  nombreLabel: 'Nombre completo',
  nombrePlaceholder: 'Nombre y apellido',
  cedulaLabel: 'Cédula / identificación',
  cedulaPlaceholder: '17XXXXXXXX',
  cedulaHelper: '10 dígitos numéricos',
  relacionLabel: 'Relación',
  telefonoLabel: 'Teléfono / contacto',
  telefonoPlaceholder: '09XXXXXXXX',
  sectionAlcance: 'Alcance de autorización',
  alcanceTitle: 'Grupo familiar del propietario',
  alcanceHelper: 'Tendrá autorización permanente para todos tus vehículos registrados.',
  cuposLabel: (n: number) => `Cupos: ${n}/${FAMILIA_MAX_MIEMBROS} usados`,
  sectionBiometria: 'Biometría presencial',
  checkboxLabel: 'La persona está presente para capturar biometría',
  helperUnchecked: 'Si no está presente, quedará con biometría pendiente. Podrá usar un pase rápido para accesos puntuales.',
  helperChecked: 'Después de confirmar, se iniciará la captura biométrica presencial.',
  cancelLabel: 'Cancelar',
  continueLabel: 'Continuar',
  confirmTitle: 'Confirmar autorización',
  confirmPersonaLabel: 'Persona',
  confirmRelacionLabel: 'Relación',
  confirmAlcanceLabel: 'Alcance',
  confirmAlcanceValue: 'Todos tus vehículos registrados',
  confirmBiometriaLabel: 'Biometría',
  confirmBiometriaCapturar: 'Se capturará a continuación',
  confirmBiometriaPendiente: 'Quedará pendiente',
  confirmText: 'Esta persona formará parte de tu grupo familiar y podrá usar tus vehículos activos mientras la autorización esté vigente.',
  backLabel: 'Volver',
  confirmCta: 'Confirmar',
  successToast: 'Persona autorizada correctamente',
  successToastPresencial: 'Persona autorizada. Iniciando captura biométrica presencial...',
  successToastPendiente: 'Persona autorizada correctamente. Cuando esté físicamente contigo, podrás registrar su biometría desde su perfil.',
} as const;

export const REVOKE_PERSONA_MODAL_COPY = {
  title: 'Revocar autorización',
  coverageLabel: 'todos tus vehículos',
  bodyText: 'Al revocar, esta persona dejará de tener acceso con tus vehículos.',
  motivoLabel: 'Motivo de revocación (opcional)',
  motivoPlaceholder: 'Ej: Ya no forma parte del grupo familiar',
  cancelLabel: 'Cancelar',
  confirmCta: 'Revocar autorización',
  successToast: 'Autorización revocada',
} as const;

export const PERSONA_DETALLE_COPY = {
  backLabel: 'Volver a Personas autorizadas',
  notFoundTitle: 'Persona no encontrada',
  notFoundDescription: 'La persona autorizada que buscas no existe o fue eliminada.',
  estadoActiva: 'Activo',
  estadoRevocada: 'Revocado',
  bioCompleta: 'Biometría completada',
  bioPendiente: 'Biometría pendiente',
  bioNoRegistrada: 'No registrada',
  sectionInfo: 'Información',
  nombreLabel: 'Nombre completo',
  cedulaLabel: 'Cédula / identificación',
  relacionLabel: 'Relación con el propietario',
  telefonoLabel: 'Teléfono / contacto',
  telefonoVacio: 'No registrado',
  autorizadoDesdeLabel: 'Fecha de autorización',
  alcanceLabel: 'Alcance',
  alcanceValue: 'Todos los vehículos del propietario',
  sectionBiometria: 'Estado biométrico',
  bioCompletaHelper: 'Validación biométrica habilitada',
  bioPendienteTitle: 'Biometría pendiente',
  bioPendienteDescription: 'La persona debe estar físicamente presente para completar el registro biométrico.',
  bioPendienteCta: 'Registrar biometría presencial',
  sectionActividad: 'Actividad reciente',
  actividadEmpty: 'Aún no hay actividad registrada para esta persona.',
  registerBioCta: 'Registrar biometría',
  revokeCta: 'Revocar autorización',
} as const;

export interface PersonaActividadMock {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

export const buildMockActividadPersona = (persona: PersonaAutorizada): PersonaActividadMock[] => [
  { id: 'act-1', title: 'Acceso autorizado · Acceso Norte', subtitle: `Validación biométrica exitosa de ${persona.nombre}`, timestamp: 'hace 2 días' },
  { id: 'act-2', title: 'Autorización actualizada', subtitle: `Alcance confirmado: ${PERSONA_DETALLE_COPY.alcanceValue}`, timestamp: persona.autorizadoDesde },
  { id: 'act-3', title: 'Acceso autorizado · Acceso Sur', subtitle: `Validación biométrica exitosa de ${persona.nombre}`, timestamp: 'hace 6 días' },
];

export const PERSONA_BIOMETRIC_CAPTURE_COPY = {
  eyebrow: 'CAPTURA BIOMÉTRICA PRESENCIAL',
  headerTitle: (nombre: string) => `Registro biométrico de ${nombre}`,
  description: 'Realiza las 3 capturas faciales de la persona autorizada. Debe estar físicamente presente durante todo el proceso.',
  successTitle: 'Biometría registrada correctamente',
  successSubtitle: 'La persona ya puede validarse automáticamente con la biometría registrada.',
  successCta: 'Volver a Personas autorizadas',
  backLabel: 'Volver a Personas autorizadas',
  notFoundTitle: 'Persona no encontrada',
  notFoundDescription: 'No se encontró la persona para registrar su biometría.',
} as const;

export const loadPersonas = (): PersonaAutorizada[] => {
  const data = localStorage.getItem('vigia_personas');
  if (!data) {
    const defaultPersonas: PersonaAutorizada[] = [
      {
        id: 'pers-1',
        personaId: 'persona-1',
        nombre: 'Andrea Torres',
        cedula: '17XXXXXX45',
        relacion: 'Cónyuge',
        tipo: 'familia',
        biometria: 'COMPLETADA',
        estado: 'ACTIVA',
        telefono: '0999999999',
        autorizadoDesde: '15 May 2026'
      },
      {
        id: 'pers-2',
        personaId: 'persona-2',
        nombre: 'Luis Pérez',
        cedula: '17XXXXXX12',
        relacion: 'Chofer',
        tipo: 'frecuente',
        biometria: 'PENDIENTE',
        estado: 'ACTIVA',
        telefono: '0988888888',
        autorizadoDesde: '18 May 2026'
      }
    ];
    localStorage.setItem('vigia_personas', JSON.stringify(defaultPersonas));
    return defaultPersonas;
  }
  return JSON.parse(data);
};

export const savePersonas = (personas: PersonaAutorizada[]): void => {
  localStorage.setItem('vigia_personas', JSON.stringify(personas));
};

