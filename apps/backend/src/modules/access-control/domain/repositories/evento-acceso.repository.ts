import { EventoAcceso } from '../entities/evento-acceso.entity';

export interface IEventoAccesoRepository {
  guardar(evento: EventoAcceso): Promise<EventoAcceso>;

  buscarPorId(id: string): Promise<EventoAcceso | null>;

  buscarRecientes(limite: number): Promise<EventoAcceso[]>;

  contarPorRangoFecha(desde: Date, hasta: Date): Promise<number>;
}
