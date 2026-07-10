// src/config/propietario-pases.config.ts
// Los pases ahora vienen de Authorization (ver mapPaseAViewModel) — este archivo
// conserva el "view model" que ya consumen PasesGrid/PaseRapidoCard/etc.

import { differenceInHours } from 'date-fns';
import { enmascararCedula } from './propietario-personas.config';
import { PaseAccesoRapido } from '../services/types/authorization.types';
import { Vehiculo } from '../services/types/registry.types';

export const DURACION_OPTIONS = [
  { label: '1 hora', value: 1 },
  { label: '2 horas', value: 2 },
  { label: '3 horas', value: 3 },
  { label: '4 horas', value: 4 },
] as const;

export interface PaseRapido {
  id: string;
  /** Código en texto plano — solo disponible justo después de generarlo (no se puede recuperar del backend). */
  codigo?: string;
  persona: string;
  cedula: string;
  vehiculo: { marca: string; modelo: string; placa: string };
  generadoEn: string; // ISO timestamp
  duracionHoras: number;
  estado: 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';
  motivo: string;
  usadoEn?: string;
  puntoAcceso?: string;
  motivoRevocacion?: string;
}

/** Combina un PaseAccesoRapido (Authorization) con el Vehículo (Registry) y, si acaba de generarse, su código en texto plano. */
export const mapPaseAViewModel = (pase: PaseAccesoRapido, vehiculo?: Vehiculo, codigoPlano?: string): PaseRapido => ({
  id: pase.id,
  codigo: codigoPlano,
  persona: pase.nombreVisitante,
  cedula: enmascararCedula(pase.cedulaVisitante),
  vehiculo: { marca: vehiculo?.marca ?? '—', modelo: vehiculo?.modelo ?? '', placa: vehiculo?.placa ?? pase.placa },
  generadoEn: pase.fechaCreacion,
  duracionHoras: Math.max(1, differenceInHours(new Date(pase.vigenciaFin), new Date(pase.vigenciaInicio))),
  estado: pase.estado,
  motivo: pase.motivo,
  usadoEn: pase.fechaConsumo,
});
