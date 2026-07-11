// application/dtos/access-control.dtos.ts
import {
  IsString, IsEnum, IsOptional, IsUUID, IsNumber, Min, Max, MinLength,
} from 'class-validator';
import { TipoMovimiento, CausaContingencia, MotivoInvitado } from '../../domain/entities/access-event.entity';

export class CrearEventoDto {
  @IsString()
  placaObservada: string;

  @IsEnum(TipoMovimiento)
  tipoMovimiento: TipoMovimiento;

  @IsOptional() @IsUUID()
  vehiculoId?: string;

  @IsOptional() @IsUUID()
  personaDetectadaId?: string;

  @IsOptional() @IsUUID()
  puntoControlId?: string;

  @IsOptional() @IsString()
  carril?: string;

  @IsOptional() @IsNumber() @Min(0) @Max(1)
  scoreBiometrico?: number;

  @IsOptional() @IsString()
  motivoCodigo?: string;

  @IsOptional() @IsString()
  evidenciaResumen?: string;
}

export class ResolverEventoDto {
  @IsEnum(['SUCCESSFUL', 'DENIED'])
  decision: 'SUCCESSFUL' | 'DENIED';

  @IsString() @MinLength(10)
  motivo: string;

  @IsOptional() @IsString()
  chipMotivoSugerido?: string;

  @IsOptional() @IsString()
  observaciones?: string;
}

export class RegistrarContingenciaDto {
  @IsEnum(CausaContingencia)
  causaContingencia: CausaContingencia;

  @IsEnum(['SUCCESSFUL', 'DENIED'])
  decisionTomada: 'SUCCESSFUL' | 'DENIED';

  @IsString() @MinLength(10)
  detalleContingencia: string;
}

export class RegistrarInvitadoDto {
  @IsString()
  placaDetectada: string;

  @IsString()
  nombreInvitado: string;

  @IsString()
  cedulaInvitado: string;

  @IsOptional() @IsString()
  facultadDestino?: string;

  @IsOptional() @IsString()
  carreraDestino?: string;

  @IsEnum(MotivoInvitado)
  motivoIngreso: MotivoInvitado;

  @IsOptional() @IsString()
  detalleMotivo?: string;

  @IsNumber()
  tiempoPermanenciaHoras: 1 | 2 | 4 | 6;
}
