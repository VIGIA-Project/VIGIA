import { MiembroGrupoFamiliar } from '../../domain/entities/miembro-grupo-familiar.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { MiembroGrupoFamiliarOrmEntity } from '../entities/miembro-grupo-familiar.orm-entity';

export class MiembroGrupoFamiliarMapper {
  static toDomain(orm: MiembroGrupoFamiliarOrmEntity): MiembroGrupoFamiliar {
    return MiembroGrupoFamiliar.crear({
      id: orm.id,
      personaId: orm.personaId,
      propietarioId: orm.propietarioId,
      relacion: orm.relacion,
      estado: orm.estado as EstadoAutorizacion,
      fechaCreacion: orm.createdAt,
      fechaActualizacion: orm.updatedAt,
    });
  }

  static toOrm(domain: MiembroGrupoFamiliar): MiembroGrupoFamiliarOrmEntity {
    const orm = new MiembroGrupoFamiliarOrmEntity();
    orm.id = domain.id;
    orm.personaId = domain.personaId;
    orm.propietarioId = domain.propietarioId;
    orm.estado = domain.estado;
    orm.relacion = domain.relacion;
    return orm;
  }
}
