// domain/repositories/access-event.repository.ts
import { EventoAcceso, DecisionOperativa } from '../entities/access-event.entity';

export interface IAccessEventRepository {
  save(evento: EventoAcceso): Promise<EventoAcceso>;
  findById(id: string): Promise<EventoAcceso | null>;
  findPendientes(puntoControlId?: string): Promise<EventoAcceso[]>;
  findByPlaca(placa: string, limit?: number): Promise<EventoAcceso[]>;
  findByTurno(puntoControlId: string, desde: Date, hasta: Date): Promise<EventoAcceso[]>;
  update(evento: EventoAcceso): Promise<EventoAcceso>;
}

export const ACCESS_EVENT_REPOSITORY = Symbol('ACCESS_EVENT_REPOSITORY');
