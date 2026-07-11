import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
    const ormEntity = NotificacionMapper.toOrm(notificacion);
    const guardado = await this.repo.save(ormEntity);
    return NotificacionMapper.toDomain(guardado);
  }

  async buscarPorRol(rol: string, limite = 20): Promise<Notificacion[]> {
    const orms = await this.repo.find({
      where: { destinatarioRol: rol, destinatarioPersonaId: IsNull() },
      order: { createdAt: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => NotificacionMapper.toDomain(orm));
  }

  async buscarPorPersona(personaId: string, limite = 20): Promise<Notificacion[]> {
    const orms = await this.repo.find({
      where: { destinatarioPersonaId: personaId },
      order: { createdAt: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => NotificacionMapper.toDomain(orm));
  }

  async buscarPorRolYPersona(rol: string, personaId: string, limite = 20): Promise<Notificacion[]> {
    const orms = await this.repo.find({
      where: [
        { destinatarioPersonaId: personaId },
        { destinatarioRol: rol, destinatarioPersonaId: IsNull() }
      ],
      order: { createdAt: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => NotificacionMapper.toDomain(orm));
  }

  async buscarPorId(id: string): Promise<Notificacion | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? NotificacionMapper.toDomain(orm) : null;
  }

  async contarNoLeidas(rol?: string, personaId?: string): Promise<number> {
    if (personaId && rol) {
      return this.repo.count({
        where: [
          { destinatarioPersonaId: personaId, leida: false },
          { destinatarioRol: rol, destinatarioPersonaId: IsNull(), leida: false }
        ]
      });
    } else if (personaId) {
      return this.repo.count({ where: { destinatarioPersonaId: personaId, leida: false } });
    } else if (rol) {
      return this.repo.count({ where: { destinatarioRol: rol, destinatarioPersonaId: IsNull(), leida: false } });
    }
    return 0;
  }
}
