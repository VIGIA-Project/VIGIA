import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAlertaRepository } from '../../domain/repositories/alerta.repository';
import { Alerta } from '../../domain/entities/alerta.entity';
import { AlertaOrmEntity } from '../entities/alerta.orm-entity';
import { AlertaMapper } from '../mappers/alerta.mapper';

@Injectable()
export class TypeOrmAlertaRepository implements IAlertaRepository {
  constructor(
    @InjectRepository(AlertaOrmEntity)
    private readonly repo: Repository<AlertaOrmEntity>,
  ) {}

  async buscarRecientes(limite = 6): Promise<Alerta[]> {
    const orms = await this.repo.find({
      order: { generadaEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => AlertaMapper.toDomain(orm));
  }

  async contarGeneradas(): Promise<number> {
    return this.repo.count();
  }
}
