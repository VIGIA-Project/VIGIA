import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAutorizacionPermanenteRepository } from '../../domain/repositories/autorizacion-permanente.repository';
import { AutorizacionPermanente } from '../../domain/entities/autorizacion-permanente.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { AutorizacionPermanenteOrmEntity } from '../entities/autorizacion-permanente.orm-entity';
import { AutorizacionPermanenteMapper } from '../mappers/autorizacion-permanente.mapper';

@Injectable()
export class TypeOrmAutorizacionPermanenteRepository
  implements IAutorizacionPermanenteRepository
{
  constructor(
    @InjectRepository(AutorizacionPermanenteOrmEntity)
    private readonly repo: Repository<AutorizacionPermanenteOrmEntity>,
  ) {}

  async guardar(autorizacion: AutorizacionPermanente): Promise<AutorizacionPermanente> {
    const orm = AutorizacionPermanenteMapper.toOrm(autorizacion);
    const saved = await this.repo.save(orm);
    return AutorizacionPermanenteMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<AutorizacionPermanente | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? AutorizacionPermanenteMapper.toDomain(orm) : null;
  }

  async buscarPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]> {
    const orms = await this.repo
      .createQueryBuilder('a')
      .where('a.vehiculo_id = :vehiculoId', { vehiculoId })
      .orderBy('a.created_at', 'DESC')
      .getMany();
    return orms.map((orm) => AutorizacionPermanenteMapper.toDomain(orm));
  }

  async buscarActivasPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]> {
    const orms = await this.repo
      .createQueryBuilder('a')
      .where('a.vehiculo_id = :vehiculoId', { vehiculoId })
      .andWhere('a.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .getMany();
    return orms.map((orm) => AutorizacionPermanenteMapper.toDomain(orm));
  }

  async buscarPorPersonaYVehiculo(
    personaId: string,
    vehiculoId: string,
  ): Promise<AutorizacionPermanente | null> {
    const orm = await this.repo
      .createQueryBuilder('a')
      .where('a.persona_id = :personaId', { personaId })
      .andWhere('a.vehiculo_id = :vehiculoId', { vehiculoId })
      .getOne();
    return orm ? AutorizacionPermanenteMapper.toDomain(orm) : null;
  }

  async existeAutorizacionActiva(personaId: string, vehiculoId: string): Promise<boolean> {
    const count = await this.repo
      .createQueryBuilder('a')
      .where('a.persona_id = :personaId', { personaId })
      .andWhere('a.vehiculo_id = :vehiculoId', { vehiculoId })
      .andWhere('a.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .getCount();
    return count > 0;
  }

  async buscarPorPropietario(propietarioId: string): Promise<AutorizacionPermanente[]> {
    const orms = await this.repo
      .createQueryBuilder('a')
      .where('a.propietario_id = :propietarioId', { propietarioId })
      .orderBy('a.created_at', 'DESC')
      .getMany();
    return orms.map((orm) => AutorizacionPermanenteMapper.toDomain(orm));
  }

  async buscarTodas(): Promise<AutorizacionPermanente[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } });
    return orms.map((orm) => AutorizacionPermanenteMapper.toDomain(orm));
  }
}
