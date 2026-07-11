import { AutorizacionPermanente } from '../../domain/entities/autorizacion-permanente.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { AutorizacionPermanenteOrmEntity } from '../entities/autorizacion-permanente.orm-entity';

export class AutorizacionPermanenteMapper {
  static toDomain(orm: AutorizacionPermanenteOrmEntity): AutorizacionPermanente {
    return AutorizacionPermanente.crear({
      id: orm.id,
      personaId: orm.personaId,
      vehiculoId: orm.vehiculoId,
      propietarioId: orm.propietarioId,
      relacion: orm.relacion,
      estado: orm.estado as EstadoAutorizacion,
      fechaCreacion: orm.createdAt,
      fechaActualizacion: orm.updatedAt,
    });
  }

  static toOrm(domain: AutorizacionPermanente): AutorizacionPermanenteOrmEntity {
    const orm = new AutorizacionPermanenteOrmEntity();
    orm.id = domain.id;
    orm.personaId = domain.personaId;
    orm.vehiculoId = domain.vehiculoId;
    orm.propietarioId = domain.propietarioId;
    orm.tipo = domain.tipo;
    orm.estado = domain.estado;
    orm.relacion = domain.relacion;
    return orm;
  }
}
