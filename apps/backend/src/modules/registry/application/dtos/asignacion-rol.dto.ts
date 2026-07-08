import { IsEnum, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { RolAsignacion } from '../../domain/entities/asignacion-rol.entity';

export class CrearAsignacionRolDto {
    @IsUUID()
    personaId: string;

    @IsUUID()
    vehiculoId: string;

    @IsEnum(RolAsignacion)
    rol: RolAsignacion;

    @IsOptional()
    @IsDateString()
    vigenteHasta?: string;
}

export class AsignacionRolResponseDto {
    asignacionRolId: string;
    personaId: string;
    vehiculoId: string;
    rol: string;
    estadoAsignacion: string;
    vigenteDesde: Date;
    vigenteHasta?: Date;
}