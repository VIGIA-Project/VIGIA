import { IsUUID, IsString, MaxLength } from 'class-validator';

export class CrearAutorizacionPermanenteDto {
  @IsUUID()
  personaId: string;

  @IsUUID()
  vehiculoId: string;

  @IsString()
  @MaxLength(50)
  relacion: string;
}
