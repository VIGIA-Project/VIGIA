import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaseGaritaRepository } from '../../domain/repositories/pase-garita.repository';
import { PaseGarita } from '../../domain/entities/pase-garita.entity';
import { PaseGaritaOrmEntity } from '../entities/pase-garita.orm-entity';
import { PaseGaritaMapper } from '../mappers/pase-garita.mapper';

@Injectable()
export class TypeOrmPaseGaritaRepository implements IPaseGaritaRepository {
  constructor(
    @InjectRepository(PaseGaritaOrmEntity)
    private readonly repo: Repository<PaseGaritaOrmEntity>,
  ) {}

  async guardar(pase: PaseGarita): Promise<PaseGarita> {
    const ormEntity = PaseGaritaMapper.toOrm(pase);
    const guardado = await this.repo.save(ormEntity);
    return PaseGaritaMapper.toDomain(guardado);
  }

  async buscarActivos(): Promise<PaseGarita[]> {
    const orms = await this.repo.find({
      where: { estado: 'ACTIVO' },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => PaseGaritaMapper.toDomain(orm));
  }

  async buscarPorPlaca(placa: string): Promise<PaseGarita[]> {
    const orms = await this.repo.find({
      where: { placaVehiculo: placa },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => PaseGaritaMapper.toDomain(orm));
  }

  async buscarTodos(limite = 20): Promise<PaseGarita[]> {
    const orms = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => PaseGaritaMapper.toDomain(orm));
  }

  async contarActivos(): Promise<number> {
    try {
      return await this.repo.count({ where: { estado: 'ACTIVO' } });
    } catch (error) {
      // Si la tabla no existe o hay error, retornar 0 por ahora
      return 0;
    }
  }

  async buscarPorId(id: string): Promise<PaseGarita | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PaseGaritaMapper.toDomain(orm) : null;
  }
}
