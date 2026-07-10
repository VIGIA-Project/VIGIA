import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEventoAccesoRepository } from '../../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../../domain/entities/evento-acceso.entity';
import { EventoAccesoOrmEntity } from '../entities/evento-acceso.orm-entity';
import { EventoAccesoMapper } from '../mappers/evento-acceso.mapper';

@Injectable()
export class TypeOrmEventoAccesoRepository implements IEventoAccesoRepository {
  constructor(
    @InjectRepository(EventoAccesoOrmEntity)
    private readonly repo: Repository<EventoAccesoOrmEntity>,
  ) {}

  async buscarRecientes(limite = 7): Promise<EventoAcceso[]> {
    const orms = await this.repo.find({
      order: { timestampEvento: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => EventoAccesoMapper.toDomain(orm));
  }
}
