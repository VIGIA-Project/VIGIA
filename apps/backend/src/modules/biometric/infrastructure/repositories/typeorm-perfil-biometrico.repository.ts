import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPerfilBiometricoRepository } from '../../domain/repositories/perfil-biometrico.repository';
import { PerfilBiometricoOrmEntity } from '../entities/perfil-biometrico.orm-entity';

import { PerfilBiometrico } from '../../domain/entities/perfil-biometrico.entity';
import { TipoPerfilBiometrico, EstadoPerfilBiometrico } from '../../domain/value-objects/perfil-biometrico.vo';

@Injectable()
export class TypeOrmPerfilBiometricoRepository implements IPerfilBiometricoRepository {
  constructor(
    @InjectRepository(PerfilBiometricoOrmEntity)
    private readonly repo: Repository<PerfilBiometricoOrmEntity>,
  ) {}

  async contarActivos(): Promise<number> {
    return this.repo.count({
      where: { estado: 'DISPONIBLE' },
    });
  }

  async obtenerTodos(): Promise<PerfilBiometrico[]> {
    const orms = await this.repo.find();
    return orms.map(orm => new PerfilBiometrico(
      orm.id,
      orm.personaId,
      TipoPerfilBiometrico.ROSTRO, // Mock default since type isn't stored in this DB schema version
      orm.estado === 'DISPONIBLE' ? EstadoPerfilBiometrico.ACTIVO : EstadoPerfilBiometrico.INACTIVO
    ));
  }

  async save(perfil: PerfilBiometrico): Promise<void> {
    const ormEntity = this.repo.create({
      id: perfil.id,
      personaId: perfil.personaId,
      estado: perfil.estado === 'ACTIVO' ? 'DISPONIBLE' : 'NO_DISPONIBLE',
    });
    await this.repo.save(ormEntity);
  }
}
