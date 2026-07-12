export class PerfilBiometricoResponseDto {
  perfilBiometricoId: string;
  personaId: string;
  personaNombre?: string;
  estadoDisponibilidad: string;
  ultimaActualizacionBiometrica?: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
