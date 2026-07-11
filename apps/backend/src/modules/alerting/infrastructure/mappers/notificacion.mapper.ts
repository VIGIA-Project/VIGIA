import { Notificacion } from '../../domain/entities/notificacion.entity';
import { CanalNotificacion, EstadoEntregaNotificacion } from '../../domain/value-objects/canal-notificacion.vo';
import { NotificacionOrmEntity } from '../entities/notificacion.orm-entity';

export class NotificacionMapper {
  static toDomain(orm: NotificacionOrmEntity): Notificacion {
    return Notificacion.crear({
      id: orm.notificacionId,
      alertaId: orm.alertaId,
      destinatarioPersonaId: orm.destinatarioPersonaId,
      canal: orm.canal as CanalNotificacion,
      titulo: orm.titulo,
      contenidoResumen: orm.contenidoResumen,
      estadoEntrega: orm.estadoEntrega as EstadoEntregaNotificacion,
      leida: orm.leida,
      leidaEn: orm.leidaEn ?? undefined,
      enviadaEn: orm.enviadaEn ?? undefined,
    });
  }

  static toOrm(domain: Notificacion): NotificacionOrmEntity {
    const orm = new NotificacionOrmEntity();
    orm.notificacionId = domain.id;
    orm.alertaId = domain.alertaId;
    orm.destinatarioPersonaId = domain.destinatarioPersonaId;
    orm.canal = domain.canal;
    orm.titulo = domain.titulo;
    orm.estadoEntrega = domain.estadoEntrega;
    orm.contenidoResumen = domain.contenidoResumen;
    orm.leida = domain.leida;
    orm.leidaEn = domain.leidaEn ?? null;
    orm.enviadaEn = domain.enviadaEn ?? null;
    return orm;
  }
}
