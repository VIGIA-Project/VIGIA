import { EventoAcceso } from '../entities/evento-acceso.entity';

export interface IEventoAccesoRepository {
  buscarRecientes(limite?: number): Promise<EventoAcceso[]>;
}
