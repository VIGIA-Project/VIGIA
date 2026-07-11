import { EventoAcceso } from '../entities/evento-acceso.entity';

export interface IEventoAccesoRepository {
  guardar(evento: EventoAcceso): Promise<void>;
  buscarRecientes(limite?: number): Promise<EventoAcceso[]>;
}
