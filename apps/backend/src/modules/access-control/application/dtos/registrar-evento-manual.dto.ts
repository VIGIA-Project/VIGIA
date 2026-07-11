import { IsString, IsEnum, IsIn, IsOptional, MinLength } from 'class-validator';
import { TipoMovimiento } from '../../domain/value-objects/tipo-movimiento.vo';
import { DecisionOperativa } from '../../domain/value-objects/decision-operativa.vo';

export class RegistrarEventoManualDto {
  @IsString()
  @MinLength(5)
  placaObservada: string;

  @IsEnum(TipoMovimiento)
  tipoMovimiento: TipoMovimiento;

  @IsIn([DecisionOperativa.SUCCESSFUL, DecisionOperativa.DENIED])
  decisionOperativa: DecisionOperativa.SUCCESSFUL | DecisionOperativa.DENIED;

  @IsString()
  @MinLength(2)
  motivoCodigo: string;

  @IsOptional()
  @IsString()
  motivoDetalle?: string;

  @IsOptional()
  @IsString()
  vehiculoId?: string;

  @IsOptional()
  @IsString()
  personaId?: string;
}
