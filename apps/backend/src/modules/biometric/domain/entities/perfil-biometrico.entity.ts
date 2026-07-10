import { TipoPerfilBiometrico, EstadoPerfilBiometrico } from '../value-objects/perfil-biometrico.vo';

export class PerfilBiometrico {
  constructor(
    public readonly id: string,
    public readonly personaId: string,
    public readonly tipoPerfil: TipoPerfilBiometrico,
    public readonly estado: EstadoPerfilBiometrico,
  ) {}
}
