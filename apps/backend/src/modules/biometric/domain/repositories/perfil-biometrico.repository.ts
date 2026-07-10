import { PerfilBiometrico } from '../entities/perfil-biometrico.entity';

export interface IPerfilBiometricoRepository {
  contarActivos(): Promise<number>;
}
