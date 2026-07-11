// src/services/types/registry.types.ts
// Tipos que reflejan los ResponseDto del BC Registry

export type IdentificacionTipo = 'CEDULA' | 'PASAPORTE' | 'RUC';

export interface Persona {
  personaId: string;
  identificacionTipo: IdentificacionTipo;
  identificacionNumero: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  correoInstitucional?: string;
  telefonoContacto?: string;
  estadoRegistro: 'ACTIVO' | 'INACTIVO';
  estadoBiometrico: 'PENDIENTE' | 'COMPLETO';
  createdAt: string;
}

export interface Vehiculo {
  vehiculoId: string;
  propietarioPersonaId: string;
  placa: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anio?: number;
  estadoRegistro: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
}

export interface CrearPersonaDto {
  identificacionTipo: IdentificacionTipo;
  identificacionNumero: string;
  nombres: string;
  apellidos: string;
  correoInstitucional?: string;
  telefonoContacto?: string;
}

export interface CrearVehiculoDto {
  propietarioPersonaId: string;
  placa: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anio?: number;
}
