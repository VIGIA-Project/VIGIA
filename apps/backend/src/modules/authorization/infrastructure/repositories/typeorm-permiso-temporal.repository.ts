import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPermisoTemporalRepository } from '../../domain/repositories/permiso-temporal.repository';
import { PermisoTemporal } from '../../domain/entities/permiso-temporal.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { PermisoTemporalOrmEntity } from '../entities/permiso-temporal.orm-entity';
import { PermisoTemporalMapper } from '../mappers/permiso-temporal.mapper';

@Injectable()
export class TypeOrmPermisoTemporalRepository implements IPermisoTemporalRepository {
  constructor(
    @InjectRepository(PermisoTemporalOrmEntity)
    private readonly repo: Repository<PermisoTemporalOrmEntity>,
  ) {}

  async guardar(permiso: PermisoTemporal): Promise<PermisoTemporal> {
    const orm = PermisoTemporalMapper.toOrm(permiso);
    const saved = await this.repo.save(orm);
    return PermisoTemporalMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<PermisoTemporal | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PermisoTemporalMapper.toDomain(orm) : null;
  }

  async buscarVigentesPorVehiculo(
    vehiculoId: string,
    instante: Date = new Date(),
  ): Promise<PermisoTemporal[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.vehiculoId = :vehiculoId', { vehiculoId })
      .andWhere('p.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .andWhere('p.vigenciaInicio <= :instante', { instante })
      .andWhere('p.vigenciaFin >= :instante', { instante })
      .getMany();
    return orms.map((orm) => PermisoTemporalMapper.toDomain(orm));
  }

  async buscarPorPersonaYVehiculo(
    personaId: string,
    vehiculoId: string,
  ): Promise<PermisoTemporal[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.personaId = :personaId', { personaId })
      .andWhere('p.vehiculoId = :vehiculoId', { vehiculoId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => PermisoTemporalMapper.toDomain(orm));
  }

  async buscarPorPersona(personaId: string): Promise<PermisoTemporal[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.personaId = :personaId', { personaId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => PermisoTemporalMapper.toDomain(orm));
  }

  async buscarProximosAExpirar(diasVentana: number): Promise<PermisoTemporal[]> {
    const ahora = new Date();
    const limite = new Date(ahora.getTime() + diasVentana * 24 * 60 * 60 * 1000);
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .andWhere('p.vigenciaFin >= :ahora', { ahora })
      .andWhere('p.vigenciaFin <= :limite', { limite })
      .getMany();
    return orms.map((orm) => PermisoTemporalMapper.toDomain(orm));
  }

  async buscarPorPropietario(propietarioId: string): Promise<PermisoTemporal[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.propietarioId = :propietarioId', { propietarioId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => PermisoTemporalMapper.toDomain(orm));
  }

  async contarVigentes(instante: Date = new Date()): Promise<number> {
    return this.repo
      .createQueryBuilder('p')
      .where('p.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .andWhere('p.vigenciaInicio <= :instante', { instante })
      .andWhere('p.vigenciaFin >= :instante', { instante })
      .getCount();
  }
}
