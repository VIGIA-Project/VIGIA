import { Notificacion } from '../entities/notificacion.entity';

export interface INotificacionRepository {
  guardar(notificacion: Notificacion): Promise<Notificacion>;
  buscarPorRol(rol: string, limite?: number): Promise<Notificacion[]>;
  buscarPorPersona(personaId: string, limite?: number): Promise<Notificacion[]>;
  buscarPorRolYPersona(rol: string, personaId: string, limite?: number): Promise<Notificacion[]>;
  buscarPorId(id: string): Promise<Notificacion | null>;
  contarNoLeidas(rol?: string, personaId?: string): Promise<number>;
}
