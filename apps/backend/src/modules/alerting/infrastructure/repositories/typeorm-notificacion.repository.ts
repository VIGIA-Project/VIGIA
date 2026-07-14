import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificacionRepository } from '../../domain/repositories/notificacion.repository';
import { Notificacion } from '../../domain/entities/notificacion.entity';
import { NotificacionOrmEntity } from '../entities/notificacion.orm-entity';
import { NotificacionMapper } from '../mappers/notificacion.mapper';

@Injectable()
export class TypeOrmNotificacionRepository implements INotificacionRepository {
  constructor(
    @InjectRepository(NotificacionOrmEntity)
    private readonly repo: Repository<NotificacionOrmEntity>,
  ) {}

  async guardar(notificacion: Notificacion): Promise<Notificacion> {
    const orm = NotificacionMapper.toOrm(notificacion);
    const saved = await this.repo.save(orm);
    return NotificacionMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<Notificacion | null> {
    const orm = await this.repo.findOne({ where: { notificacionId: id } });
    return orm ? NotificacionMapper.toDomain(orm) : null;
  }

  async buscarPorDestinatario(destinatarioPersonaId: string): Promise<Notificacion[]> {
    const orms = await this.repo.find({
      where: { destinatarioPersonaId },
      order: { enviadaEn: 'DESC' },
    });
    return orms.map((orm) => NotificacionMapper.toDomain(orm));
  }

  async buscarTodas(limite: number): Promise<Notificacion[]> {
    const orms = await this.repo.find({
      order: { enviadaEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => NotificacionMapper.toDomain(orm));
  }
}
