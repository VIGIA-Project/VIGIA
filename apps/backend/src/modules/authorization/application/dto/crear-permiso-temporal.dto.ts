import { IsUUID, IsDateString, IsString, MaxLength, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

const VIGENCIA_MAXIMA_DIAS = 30;

/**
 * Valida que `vigenciaFin` no supere `vigenciaInicio` + 30 días.
 */
function MaxVigenciaDias(diasMaximos: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxVigenciaDias',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(fin: string, args: ValidationArguments) {
          const inicio = (args.object as CrearPermisoTemporalDto).vigenciaInicio;
          if (!inicio || !fin) return true;
          const inicioDate = new Date(inicio);
          const finDate = new Date(fin);
          if (finDate <= inicioDate) return false;
          const diasSolicitados =
            (finDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24);
          return diasSolicitados <= diasMaximos;
        },
        defaultMessage() {
          return `La vigencia máxima de un permiso temporal es de ${diasMaximos} días y vigenciaFin debe ser posterior a vigenciaInicio`;
        },
      },
    });
  };
}

export class CrearPermisoTemporalDto {
  @IsUUID()
  personaId: string;

  @IsUUID()
  vehiculoId: string;

  @IsDateString()
  vigenciaInicio: string;

  @IsDateString()
  @MaxVigenciaDias(VIGENCIA_MAXIMA_DIAS)
  vigenciaFin: string;

  @IsString()
  @MaxLength(255)
  motivo: string;
}
