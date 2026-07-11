import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EntityAlreadyExistsException, EntityNotFoundException } from '@core/exceptions/domain-exception';
import { PERFIL_BIOMETRICO_REPOSITORY } from '@shared/constants/injection-tokens';
import { REGISTRY_PORT } from '../../registry/application/ports/registry.port';
import type { IRegistryPort } from '../../registry/application/ports/registry.port';
import { IPerfilBiometricoRepository } from '../domain/repositories/perfil-biometrico.repository';
import { PerfilBiometrico } from '../domain/entities/perfil-biometrico.entity';
import { PerfilBiometricoResponseDto } from './dto/perfil-biometrico-response.dto';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Biometric.
 * El servicio de IA (captura de embeddings) aún no está conectado: aquí
 * solo se administra el estado de disponibilidad del perfil.
 */
@Injectable()
export class BiometricService {
  constructor(
    @Inject(PERFIL_BIOMETRICO_REPOSITORY)
    private readonly perfilBiometricoRepository: IPerfilBiometricoRepository,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
  ) {}

  async crearPerfil(personaId: string): Promise<PerfilBiometrico> {
    const persona = await this.registryPort.findPersonaById(personaId);
    if (!persona) {
      throw new EntityNotFoundException('Persona', personaId);
    }

    const existente = await this.perfilBiometricoRepository.buscarPorPersonaId(personaId);
    if (existente) {
      throw new EntityAlreadyExistsException('PerfilBiometrico', personaId);
    }

    const perfil = PerfilBiometrico.crear({
      id: uuidv4(),
      personaId,
    });
    return this.perfilBiometricoRepository.guardar(perfil);
  }

  async buscarPorPersonaId(personaId: string): Promise<PerfilBiometrico | null> {
    return this.perfilBiometricoRepository.buscarPorPersonaId(personaId);
  }

  async contarDisponibles(): Promise<number> {
    return this.perfilBiometricoRepository.contarDisponibles();
  }

  async listarConNombrePersona(): Promise<PerfilBiometricoResponseDto[]> {
    const perfiles = await this.perfilBiometricoRepository.listarTodos();
    return Promise.all(
      perfiles.map(async (perfil) => {
        const persona = await this.registryPort.findPersonaById(perfil.personaId);
        return {
          ...perfil.toJSON(),
          personaNombre: persona?.nombreCompleto,
        };
      }),
    );
  }
}
