import { PaseGarita } from '../entities/pase-garita.entity';

export interface IPaseGaritaRepository {
  guardar(pase: PaseGarita): Promise<PaseGarita>;
  buscarActivos(): Promise<PaseGarita[]>;
  buscarPorPlaca(placa: string): Promise<PaseGarita[]>;
  buscarTodos(limite?: number): Promise<PaseGarita[]>;
  contarActivos(): Promise<number>;
  buscarPorId(id: string): Promise<PaseGarita | null>;
}
