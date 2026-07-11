import { Injectable, Inject } from '@nestjs/common';
import { IPerfilBiometricoRepository } from '../domain/repositories/perfil-biometrico.repository';

export const PERFIL_BIOMETRICO_REPOSITORY = 'PERFIL_BIOMETRICO_REPOSITORY';

import { PerfilBiometrico } from '../domain/entities/perfil-biometrico.entity';
import { TipoPerfilBiometrico, EstadoPerfilBiometrico } from '../domain/value-objects/perfil-biometrico.vo';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BiometricService {
  constructor(
    @Inject(PERFIL_BIOMETRICO_REPOSITORY)
    private readonly perfilRepository: IPerfilBiometricoRepository,
  ) {}

  async contarPerfilesActivos(): Promise<number> {
    return this.perfilRepository.contarActivos();
  }

  async obtenerTodos(): Promise<PerfilBiometrico[]> {
    return this.perfilRepository.obtenerTodos();
  }

  async registrarPerfil(personaId: string): Promise<void> {
    const perfil = new PerfilBiometrico(
      uuidv4(),
      personaId,
      TipoPerfilBiometrico.ROSTRO, // Mock for now
      EstadoPerfilBiometrico.ACTIVO
    );
    await this.perfilRepository.save(perfil);
  }
}
