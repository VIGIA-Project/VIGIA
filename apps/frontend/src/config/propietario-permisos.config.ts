// src/config/propietario-permisos.config.ts
// Los permisos ahora vienen de Authorization + Registry (ver mapPermisoAViewModel) —
// este archivo conserva el "view model" que ya consumen PermisosGrid/PermisoTemporalCard/etc.

import { format } from 'date-fns';
import { enmascararCedula } from './propietario-personas.config';
import { PermisoTemporal as PermisoTemporalApi, EstadoAutorizacion } from '../services/types/authorization.types';
import { Persona } from '../services/types/registry.types';
import { Vehiculo } from '../services/types/registry.types';

export const MOTIVO_OPTIONS = ['Visita familiar', 'Préstamo temporal', 'Trámite personal', 'Emergencia', 'Otro'] as const;

export interface PermisoTemporal {
  /** id del PermisoTemporal en Authorization — usado para revocar */
  id: string;
  /** id de la Persona en Registry */
  personaId: string;
  persona: string;
  cedula: string;
  telefono?: string;
  vehiculo: { marca: string; modelo: string; placa: string };
  fechaInicio: string;
  fechaFin: string;
  estado: 'ACTIVO' | 'EXPIRADO' | 'REVOCADO';
  motivo: string;
  motivoRevocacion?: string;
}

const ESTADO_MAP: Record<EstadoAutorizacion, PermisoTemporal['estado']> = {
  ACTIVA: 'ACTIVO',
  EXPIRADA: 'EXPIRADO',
  REVOCADA: 'REVOCADO',
  INACTIVA: 'EXPIRADO',
};

/** Combina un PermisoTemporal (Authorization) con su Persona y Vehículo (Registry). */
export const mapPermisoAViewModel = (
  permiso: PermisoTemporalApi,
  persona?: Persona,
  vehiculo?: Vehiculo
): PermisoTemporal => ({
  id: permiso.id,
  personaId: permiso.personaId,
  persona: persona?.nombreCompleto ?? 'Cargando…',
  cedula: persona ? enmascararCedula(persona.identificacionNumero) : '—',
  telefono: persona?.telefonoContacto,
  vehiculo: { marca: vehiculo?.marca ?? '—', modelo: vehiculo?.modelo ?? '', placa: vehiculo?.placa ?? '—' },
  fechaInicio: format(new Date(permiso.vigenciaInicio), 'yyyy-MM-dd'),
  fechaFin: format(new Date(permiso.vigenciaFin), 'yyyy-MM-dd'),
  estado: (ESTADO_MAP[permiso.estado] === 'ACTIVO' && new Date(permiso.vigenciaFin) < new Date()) ? 'EXPIRADO' : ESTADO_MAP[permiso.estado],
  motivo: permiso.motivo,
});
