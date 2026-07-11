import { IsUUID, IsString, IsOptional, MaxLength } from 'class-validator';

export class CrearMiembroGrupoFamiliarDto {
  @IsUUID()
  personaId: string;

  @IsString()
  @MaxLength(50)
  relacion: string;
}

// TODO: eliminar alias legacy después de actualizar frontend
// DTO temporal para el endpoint POST /authorization/permanentes — el frontend
// actual sigue enviando `vehiculoId` en el body, que ya no se usa (el grupo
// familiar se vincula al propietario, no a un vehículo) pero se acepta y se
// ignora aquí para no romper la petición mientras se actualiza el frontend.
export class CrearAutorizacionPermanenteLegacyDto extends CrearMiembroGrupoFamiliarDto {
  @IsUUID()
  @IsOptional()
  vehiculoId?: string;
}
