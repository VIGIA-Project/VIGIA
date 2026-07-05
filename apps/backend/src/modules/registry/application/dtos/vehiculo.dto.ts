import {
    IsString,
    IsOptional,
    IsInt,
    Min,
    Max,
    IsUUID,
    MinLength,
} from 'class-validator';

export class CrearVehiculoDto {
    @IsUUID()
    propietarioPersonaId: string;

    @IsString()
    @MinLength(4)
    placa: string;

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    modelo?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(2100)
    anio?: number;
}

export class ActualizarVehiculoDto {
    @IsOptional()
    @IsString()
    @MinLength(4)
    placa?: string;

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    modelo?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(2100)
    anio?: number;
}

export class VehiculoResponseDto {
    vehiculoId: string;
    propietarioPersonaId: string;
    placa: string;
    marca?: string;
    modelo?: string;
    color?: string;
    anio?: number;
    estadoRegistro: string;
    createdAt: Date;
}