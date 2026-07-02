import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { AccessEventType } from '@shared/enums';

export class RegisterAccessEventDto {
  @IsString()
  licensePlate: string;

  @IsString()
  accessPointId: string;

  @IsEnum(AccessEventType)
  eventType: AccessEventType;

  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
