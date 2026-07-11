import { PerfilBiometrico } from '../entities/perfil-biometrico.entity';

export interface IPerfilBiometricoRepository {
  contarActivos(): Promise<number>;
  save(perfil: PerfilBiometrico): Promise<void>;
  obtenerTodos(): Promise<PerfilBiometrico[]>;
}
