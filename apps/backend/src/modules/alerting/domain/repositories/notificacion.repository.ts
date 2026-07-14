import { Notificacion } from '../entities/notificacion.entity';

export interface INotificacionRepository {
  guardar(notificacion: Notificacion): Promise<Notificacion>;

  buscarPorId(id: string): Promise<Notificacion | null>;

  buscarPorDestinatario(destinatarioPersonaId: string): Promise<Notificacion[]>;

  buscarTodas(limite: number): Promise<Notificacion[]>;
}
