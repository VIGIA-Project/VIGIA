import { Alerta } from '../entities/alerta.entity';

export interface IAlertaRepository {
  buscarPorId(id: string): Promise<Alerta | null>;

  buscarRecientes(limite: number): Promise<Alerta[]>;

  contarNoResueltas(): Promise<number>;
}
