// src/config/propietario-pases.config.ts

export const DURACION_OPTIONS = [
  { label: '1 hora', value: 1 },
  { label: '2 horas', value: 2 },
  { label: '3 horas', value: 3 },
  { label: '4 horas', value: 4 },
] as const;

export const generarCodigo = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O, 1/I/l
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `VIGIA-${code}`;
};

export interface PaseRapido {
  id: string;
  codigo: string;
  persona: string;
  cedula: string;
  relacion: string;
  vehiculo: { marca: string; modelo: string; placa: string };
  generadoEn: string; // ISO timestamp
  duracionHoras: number;
  estado: 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';
  motivo: string;
  usadoEn?: string;
  puntoAcceso?: string;
  motivoRevocacion?: string;
}

export const MOCK_PASES: PaseRapido[] = [
  { id: '1', codigo: 'VIGIA-A7X9', persona: 'Pedro Sánchez', cedula: '17XXXXXX34', relacion: 'Trámite personal', vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' }, generadoEn: '2026-07-08T22:00:00', duracionHoras: 2, estado: 'ACTIVO', motivo: 'Entrega de repuestos del taller' },
  { id: '2', codigo: 'VIGIA-K3M2', persona: 'Laura Vega', cedula: '10XXXXXX67', relacion: 'Visita familiar', vehiculo: { marca: 'Chevrolet', modelo: 'Aveo', placa: 'XYZ-5678' }, generadoEn: '2026-07-07T10:00:00', duracionHoras: 3, estado: 'CONSUMIDO', motivo: 'Recoger documentos personales', usadoEn: '2026-07-07T11:30:00', puntoAcceso: 'Garita Norte' },
  { id: '3', codigo: 'VIGIA-P5N8', persona: 'Diego Mora', cedula: '05XXXXXX90', relacion: 'Préstamo temporal', vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-1234' }, generadoEn: '2026-07-06T08:00:00', duracionHoras: 4, estado: 'EXPIRADO', motivo: 'Trámite en registraduría' },
  { id: '4', codigo: 'VIGIA-R2D4', persona: 'Ana Torres', cedula: '13XXXXXX78', relacion: 'Emergencia', vehiculo: { marca: 'Chevrolet', modelo: 'Aveo', placa: 'XYZ-5678' }, generadoEn: '2026-07-05T14:00:00', duracionHoras: 1, estado: 'REVOCADO', motivo: 'Emergencia médica familiar', motivoRevocacion: 'Situación resuelta antes de tiempo' },
];
