export enum SeveridadNotificacion {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  INFORMATIVA = 'INFORMATIVA',
}

export class Notificacion {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly subtitulo: string,
    public readonly severidad: SeveridadNotificacion,
    public readonly destinatarioRol: string | null,
    public readonly destinatarioPersonaId: string | null,
    public leida: boolean,
    public readonly referenciaId: string | null,
    public readonly createdAt: Date,
  ) {}

  marcarLeida(): void {
    this.leida = true;
  }
}
