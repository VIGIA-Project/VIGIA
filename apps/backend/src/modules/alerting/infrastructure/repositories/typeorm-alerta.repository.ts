import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { IAlertaRepository } from '../../domain/repositories/alerta.repository';
import { Alerta } from '../../domain/entities/alerta.entity';
import { EstadoAtencionAlerta } from '../../domain/value-objects/estado-atencion-alerta.vo';
import { AlertaOrmEntity } from '../entities/alerta.orm-entity';
import { AlertaMapper } from '../mappers/alerta.mapper';

@Injectable()
export class TypeOrmAlertaRepository implements IAlertaRepository {
  constructor(
    @InjectRepository(AlertaOrmEntity)
    private readonly repo: Repository<AlertaOrmEntity>,
  ) {}

  async buscarPorId(id: string): Promise<Alerta | null> {
    const orm = await this.repo.findOne({ where: { alertaId: id } });
    return orm ? AlertaMapper.toDomain(orm) : null;
  }

  async buscarRecientes(limite: number): Promise<Alerta[]> {
    const orms = await this.repo.find({
      order: { generadaEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => AlertaMapper.toDomain(orm));
  }

  async contarNoResueltas(): Promise<number> {
    return this.repo.count({
      where: { estadoAtencion: Not(EstadoAtencionAlerta.ATENDIDA) },
    });
  }
}
