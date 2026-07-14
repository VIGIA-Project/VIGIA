import { IsString, Length } from 'class-validator';

export class ValidarPaseDto {
  @IsString()
  @Length(6, 6)
  codigo: string;

  @IsString()
  @Length(5, 10)
  placa: string;
}
