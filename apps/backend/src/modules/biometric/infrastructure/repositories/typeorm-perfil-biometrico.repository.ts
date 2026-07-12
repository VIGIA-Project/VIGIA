import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPerfilBiometricoRepository } from '../../domain/repositories/perfil-biometrico.repository';
import { PerfilBiometrico } from '../../domain/entities/perfil-biometrico.entity';
import { EstadoDisponibilidad } from '../../domain/value-objects/estado-disponibilidad.vo';
import { PerfilBiometricoOrmEntity } from '../entities/perfil-biometrico.orm-entity';
import { PerfilBiometricoMapper } from '../mappers/perfil-biometrico.mapper';

@Injectable()
export class TypeOrmPerfilBiometricoRepository implements IPerfilBiometricoRepository {
  constructor(
    @InjectRepository(PerfilBiometricoOrmEntity)
    private readonly repo: Repository<PerfilBiometricoOrmEntity>,
  ) {}

  async guardar(perfil: PerfilBiometrico): Promise<PerfilBiometrico> {
    const orm = PerfilBiometricoMapper.toOrm(perfil);
    const saved = await this.repo.save(orm);
    return PerfilBiometricoMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<PerfilBiometrico | null> {
    const orm = await this.repo.findOne({ where: { perfilBiometricoId: id } });
    return orm ? PerfilBiometricoMapper.toDomain(orm) : null;
  }

  async buscarPorPersonaId(personaId: string): Promise<PerfilBiometrico | null> {
    const orm = await this.repo.findOne({ where: { personaId } });
    return orm ? PerfilBiometricoMapper.toDomain(orm) : null;
  }

  async listarTodos(): Promise<PerfilBiometrico[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orms.map((orm) => PerfilBiometricoMapper.toDomain(orm));
  }

  async contarDisponibles(): Promise<number> {
    return this.repo.count({ where: { estadoDisponibilidad: EstadoDisponibilidad.DISPONIBLE } });
  }
}
