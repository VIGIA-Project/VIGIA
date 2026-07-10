import { Injectable, Inject } from '@nestjs/common';
import { IPerfilBiometricoRepository } from '../domain/repositories/perfil-biometrico.repository';

export const PERFIL_BIOMETRICO_REPOSITORY = 'PERFIL_BIOMETRICO_REPOSITORY';

@Injectable()
export class BiometricService {
  constructor(
    @Inject(PERFIL_BIOMETRICO_REPOSITORY)
    private readonly perfilRepository: IPerfilBiometricoRepository,
  ) {}

  async contarPerfilesActivos(): Promise<number> {
    return this.perfilRepository.contarActivos();
  }
}
