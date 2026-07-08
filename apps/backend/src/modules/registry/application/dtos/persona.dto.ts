import {
    IsString,
    IsEnum,
    IsOptional,
    IsEmail,
    MinLength,
} from 'class-validator';
import { IdentificacionTipo } from '../../domain/entities/persona.entity';

export class CrearPersonaDto {
    @IsEnum(IdentificacionTipo)
    identificacionTipo: IdentificacionTipo;

    @IsString()
    @MinLength(5)
    identificacionNumero: string;

    @IsString()
    @MinLength(2)
    nombres: string;

    @IsString()
    @MinLength(2)
    apellidos: string;

    @IsOptional()
    @IsEmail()
    correoInstitucional?: string;

    @IsOptional()
    @IsString()
    telefonoContacto?: string;
}

export class ActualizarPersonaDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    nombres?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    apellidos?: string;

    @IsOptional()
    @IsEmail()
    correoInstitucional?: string;

    @IsOptional()
    @IsString()
    telefonoContacto?: string;
}

export class PersonaResponseDto {
    personaId: string;
    identificacionTipo: string;
    identificacionNumero: string;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    correoInstitucional?: string;
    telefonoContacto?: string;
    estadoRegistro: string;
    estadoBiometrico: string;
    createdAt: Date;
}