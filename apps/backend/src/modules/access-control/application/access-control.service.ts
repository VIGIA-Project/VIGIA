import { Injectable, Inject } from '@nestjs/common';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';

export const EVENTO_ACCESO_REPOSITORY = 'EVENTO_ACCESO_REPOSITORY';

@Injectable()
export class AccessControlService {
  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
  ) {}

  async obtenerEventosRecientes(limite = 7): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }
}
