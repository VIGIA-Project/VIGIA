import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPerfilBiometricoRepository } from '../../domain/repositories/perfil-biometrico.repository';
import { PerfilBiometricoOrmEntity } from '../entities/perfil-biometrico.orm-entity';

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
}
