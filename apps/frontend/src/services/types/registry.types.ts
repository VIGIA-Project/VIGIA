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

export interface ActualizarVehiculoDto {
  placa?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anio?: number;
}

export interface ActualizarPersonaDto {
  nombres?: string;
  apellidos?: string;
  correoInstitucional?: string;
  telefonoContacto?: string;
}

export type RolAsignacion = 'PROPIETARIO' | 'FAMILIAR_AUTORIZADO' | 'CONDUCTOR_PERMANENTE' | 'PERSONA_AUTORIZADA';
export type EstadoAsignacion = 'ACTIVA' | 'INACTIVA';

export interface AsignacionRol {
  asignacionRolId: string;
  personaId: string;
  vehiculoId: string;
  rol: RolAsignacion;
  estadoAsignacion: EstadoAsignacion;
  vigenteDesde: string;
  vigenteHasta?: string;
}

export interface CrearAsignacionRolDto {
  personaId: string;
  vehiculoId: string;
  rol: RolAsignacion;
  vigenteHasta?: string;
}
