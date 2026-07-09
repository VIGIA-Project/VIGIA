// src/config/propietario-permisos.config.ts

export const MOTIVO_OPTIONS = ['Visita familiar', 'Préstamo temporal', 'Trámite personal', 'Emergencia', 'Otro'] as const;

export interface VehiculoPropietario {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  color: string;
  anio: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export const MOCK_VEHICULOS_PROPIETARIO: VehiculoPropietario[] = [
  { id: '1', marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234', color: 'Blanco', anio: 2022, estado: 'ACTIVO' },
  { id: '2', marca: 'Chevrolet', modelo: 'Aveo', placa: 'XYZ-5678', color: 'Gris', anio: 2020, estado: 'ACTIVO' },
  { id: '3', marca: 'Kia', modelo: 'Sportage', placa: 'JKL-4455', color: 'Negro', anio: 2021, estado: 'INACTIVO' },
];

export interface PermisoTemporal {
  id: string;
  persona: string;
  cedula: string;
  relacion: string;
  telefono?: string;
  vehiculo: { marca: string; modelo: string; placa: string };
  fechaInicio: string;
  fechaFin: string;
  estado: 'ACTIVO' | 'EXPIRADO' | 'REVOCADO';
  motivo: string;
  motivoRevocacion?: string;
}

export const MOCK_PERMISOS: PermisoTemporal[] = [
  { id: '1', persona: 'Roberto Gómez', cedula: '17XXXXXX89', relacion: 'Préstamo temporal', telefono: '0991234567', vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' }, fechaInicio: '2026-07-05', fechaFin: '2026-07-15', estado: 'ACTIVO', motivo: 'Necesita el vehículo para trámite en otra ciudad' },
  { id: '2', persona: 'María López', cedula: '10XXXXXX56', relacion: 'Visita familiar', telefono: '', vehiculo: { marca: 'Chevrolet', modelo: 'Aveo', placa: 'XYZ-5678' }, fechaInicio: '2026-06-01', fechaFin: '2026-06-10', estado: 'EXPIRADO', motivo: 'Visita de familiar desde Guayaquil' },
  { id: '3', persona: 'Juan Paredes', cedula: '05XXXXXX23', relacion: 'Trámite personal', telefono: '0987654321', vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' }, fechaInicio: '2026-06-15', fechaFin: '2026-06-20', estado: 'REVOCADO', motivo: 'Trámite vehicular en agencia', motivoRevocacion: 'Trámite se canceló' },
];
