import { IsUUID } from 'class-validator';

export class ConsumirPaseDto {
  @IsUUID()
  eventoId: string;
}
