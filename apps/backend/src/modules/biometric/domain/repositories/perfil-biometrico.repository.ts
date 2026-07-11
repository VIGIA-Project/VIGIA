import { PerfilBiometrico } from '../entities/perfil-biometrico.entity';

export interface IPerfilBiometricoRepository {
  guardar(perfil: PerfilBiometrico): Promise<PerfilBiometrico>;

  buscarPorId(id: string): Promise<PerfilBiometrico | null>;

  buscarPorPersonaId(personaId: string): Promise<PerfilBiometrico | null>;

  listarTodos(): Promise<PerfilBiometrico[]>;

  contarDisponibles(): Promise<number>;
}
