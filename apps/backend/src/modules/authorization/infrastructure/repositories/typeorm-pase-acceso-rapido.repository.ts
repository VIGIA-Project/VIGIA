import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaseAccesoRapidoRepository } from '../../domain/repositories/pase-acceso-rapido.repository';
import { PaseAccesoRapido } from '../../domain/entities/pase-acceso-rapido.entity';
import { EstadoPase } from '../../domain/value-objects/estado-pase.vo';
import { PaseAccesoRapidoOrmEntity } from '../entities/pase-acceso-rapido.orm-entity';
import { PaseAccesoRapidoMapper } from '../mappers/pase-acceso-rapido.mapper';

@Injectable()
export class TypeOrmPaseAccesoRapidoRepository implements IPaseAccesoRapidoRepository {
  constructor(
    @InjectRepository(PaseAccesoRapidoOrmEntity)
    private readonly repo: Repository<PaseAccesoRapidoOrmEntity>,
  ) {}

  async guardar(pase: PaseAccesoRapido): Promise<PaseAccesoRapido> {
    const orm = PaseAccesoRapidoMapper.toOrm(pase);
    const saved = await this.repo.save(orm);
    return PaseAccesoRapidoMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<PaseAccesoRapido | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PaseAccesoRapidoMapper.toDomain(orm) : null;
  }

  async buscarActivosPorPlaca(
    placa: string,
    instante: Date = new Date(),
  ): Promise<PaseAccesoRapido[]> {
    const placaNormalizada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.placa = :placa', { placa: placaNormalizada })
      .andWhere('p.estado = :estado', { estado: EstadoPase.ACTIVO })
      .andWhere('p.vigenciaInicio <= :instante', { instante })
      .andWhere('p.vigenciaFin >= :instante', { instante })
      .getMany();
    return orms.map((orm) => PaseAccesoRapidoMapper.toDomain(orm));
  }

  async buscarPorVehiculoYEstado(
    vehiculoId: string,
    estado: EstadoPase,
  ): Promise<PaseAccesoRapido[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.vehiculoId = :vehiculoId', { vehiculoId })
      .andWhere('p.estado = :estado', { estado })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => PaseAccesoRapidoMapper.toDomain(orm));
  }

  async buscarPorPropietario(propietarioId: string): Promise<PaseAccesoRapido[]> {
    const orms = await this.repo
      .createQueryBuilder('p')
      .where('p.propietarioId = :propietarioId', { propietarioId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => PaseAccesoRapidoMapper.toDomain(orm));
  }

  async buscarTodos(limite = 30): Promise<PaseAccesoRapido[]> {
    const orms = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => PaseAccesoRapidoMapper.toDomain(orm));
  }

  async contarActivos(): Promise<number> {
    return this.repo
      .createQueryBuilder('p')
      .where('p.estado = :estado', { estado: EstadoPase.ACTIVO })
      .getCount();
  }
}
