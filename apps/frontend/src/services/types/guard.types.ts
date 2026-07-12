// apps/frontend/src/services/types/guard.types.ts
export interface EventoAcceso {
    id: string;
    placaCapturada: string;
    tipoMovimiento: 'ENTRADA' | 'SALIDA';
    decision: 'AUTORIZADO' | 'DENEGADO' | 'CONTINGENCIA';
    fechaHora: string;
    vehiculoId?: string;
    personaId?: string;
    detalles?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PersonaAutorizada {
    id: string;
    nombre: string;
    cedula: string;
    telefono?: string;
    email?: string;
    tipoRelacion: 'PROPIETARIO' | 'FAMILIAR' | 'PERMISO_TEMPORAL';
    fechaInicio?: string;
    fechaFin?: string;
}

export interface ConjuntoAutorizado {
    vehiculoId: string;
    placa: string;
    propietario: PersonaAutorizada;
    familiares: PersonaAutorizada[];
    permisosTemporales: PersonaAutorizada[];
    totalAutorizados: number;
}

export interface PaseActivo {
    id: string;
    codigo: string;
    placa: string;
    vehiculoId: string;
    creadoPor: string;
    fechaInicio: string;
    fechaFin: string;
    estado: 'ACTIVO' | 'CONSUMIDO' | 'VENCIDO';
    consumoId?: string;
    fechaConsumo?: string;
}

export interface ValidarPaseResponse {
    valido: boolean;
    pase?: PaseActivo;
    mensaje: string;
}

export interface RegistrarEventoDto {
    placaCapturada: string;
    tipoMovimiento: 'ENTRADA' | 'SALIDA';
    decision: 'AUTORIZADO' | 'DENEGADO' | 'CONTINGENCIA';
    detalles?: string;
    vehiculoId?: string;
    personaId?: string;
}

export interface Alerta {
    id: string;
    titulo: string;
    descripcion: string;
    nivel: 'INFORMACION' | 'ADVERTENCIA' | 'CRITICO';
    estado_atencion: 'GENERADA' | 'ENTREGADA' | 'ATENDIDA';
    fechaGeneracion: string;
    fechaAtencion?: string;
    origen: string;
    datosAdicionales?: any;
}

export interface VehiculoResponse {
    id: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    anio: number;
    propietarioId: string;
    propietarioNombre: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    createdAt: string;
    updatedAt: string;
}