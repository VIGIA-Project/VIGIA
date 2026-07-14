import { IsUUID, IsString, IsDateString, MaxLength, MinLength } from 'class-validator';

export class CrearPaseRapidoDto {
  @IsUUID()
  vehiculoId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(10)
  placa: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  nombreVisitante: string;

  @IsString()
  @MaxLength(20)
  cedulaVisitante: string;

  @IsDateString()
  vigenciaInicio: string;

  @IsDateString()
  vigenciaFin: string;

  @IsString()
  @MaxLength(255)
  motivo: string;
}
