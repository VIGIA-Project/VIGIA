import { Injectable, Inject } from '@nestjs/common';
import { IAlertaRepository } from '../domain/repositories/alerta.repository';
import { Alerta } from '../domain/entities/alerta.entity';

export const ALERTA_REPOSITORY = 'ALERTA_REPOSITORY';

@Injectable()
export class AlertingService {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: IAlertaRepository,
  ) {}

  async obtenerAlertasRecientes(limite = 6): Promise<Alerta[]> {
    return this.alertaRepository.buscarRecientes(limite);
  }

  async contarTotalAlertas(): Promise<number> {
    return this.alertaRepository.contarGeneradas();
  }
}
