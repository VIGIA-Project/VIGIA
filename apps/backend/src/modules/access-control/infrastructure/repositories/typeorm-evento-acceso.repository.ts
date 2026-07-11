import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

  async guardar(evento: EventoAcceso): Promise<EventoAcceso> {
    const orm = EventoAccesoMapper.toOrm(evento);
    const saved = await this.repo.save(orm);
    return EventoAccesoMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<EventoAcceso | null> {
    const orm = await this.repo.findOne({ where: { eventoAccesoId: id } });
    return orm ? EventoAccesoMapper.toDomain(orm) : null;
  }

  async buscarRecientes(limite: number): Promise<EventoAcceso[]> {
    const orms = await this.repo.find({
      order: { capturadoEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => EventoAccesoMapper.toDomain(orm));
  }

  async contarPorRangoFecha(desde: Date, hasta: Date): Promise<number> {
    return this.repo.count({
      where: { capturadoEn: Between(desde, hasta) },
    });
  }
}
