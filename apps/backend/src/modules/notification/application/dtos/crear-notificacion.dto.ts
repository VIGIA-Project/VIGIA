import { SeveridadNotificacion } from '../../domain/entities/notificacion.entity';

export class CrearNotificacionDto {
  titulo: string;
  subtitulo: string;
  severidad?: SeveridadNotificacion;
  destinatarioRol?: string | null;
  destinatarioPersonaId?: string | null;
  referenciaId?: string | null;
}
