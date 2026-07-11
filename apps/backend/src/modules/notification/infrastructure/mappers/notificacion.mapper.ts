import { Notificacion, SeveridadNotificacion } from '../../domain/entities/notificacion.entity';
import { NotificacionOrmEntity } from '../entities/notificacion.orm-entity';

export class NotificacionMapper {
  static toDomain(orm: NotificacionOrmEntity): Notificacion {
    return new Notificacion(
      orm.id,
      orm.titulo,
      orm.subtitulo,
      orm.severidad as SeveridadNotificacion,
      orm.destinatarioRol,
      orm.destinatarioPersonaId,
      orm.leida,
      orm.referenciaId,
      orm.createdAt,
    );
  }

  static toOrm(domain: Notificacion): NotificacionOrmEntity {
    const orm = new NotificacionOrmEntity();
    orm.id = domain.id;
    orm.titulo = domain.titulo;
    orm.subtitulo = domain.subtitulo;
    orm.severidad = domain.severidad;
    orm.destinatarioRol = domain.destinatarioRol;
    orm.destinatarioPersonaId = domain.destinatarioPersonaId;
    orm.leida = domain.leida;
    orm.referenciaId = domain.referenciaId;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
