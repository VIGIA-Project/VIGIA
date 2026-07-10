import { Alerta } from '../entities/alerta.entity';

export interface IAlertaRepository {
  buscarRecientes(limite?: number): Promise<Alerta[]>;
  contarGeneradas(): Promise<number>;
}
