import { PermisoTemporal } from '../../domain/entities/permiso-temporal.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { Vigencia } from '../../domain/value-objects/vigencia.vo';
import { PermisoTemporalOrmEntity } from '../entities/permiso-temporal.orm-entity';

export class PermisoTemporalMapper {
  static toDomain(orm: PermisoTemporalOrmEntity): PermisoTemporal {
    return PermisoTemporal.crear({
      id: orm.id,
      personaId: orm.personaId,
      vehiculoId: orm.vehiculoId,
      propietarioId: orm.propietarioId,
      vigencia: Vigencia.crear(orm.vigenciaInicio, orm.vigenciaFin),
      motivo: orm.motivo,
      estado: orm.estado as EstadoAutorizacion,
      fechaCreacion: orm.createdAt,
      fechaRevocacion: orm.fechaRevocacion ?? undefined,
    });
  }

  static toOrm(domain: PermisoTemporal): PermisoTemporalOrmEntity {
    const orm = new PermisoTemporalOrmEntity();
    orm.id = domain.id;
    orm.personaId = domain.personaId;
    orm.vehiculoId = domain.vehiculoId;
    orm.propietarioId = domain.propietarioId;
    orm.tipo = domain.tipo;
    orm.estado = domain.estado;
    orm.vigenciaInicio = domain.vigencia.inicio;
    orm.vigenciaFin = domain.vigencia.fin;
    orm.motivo = domain.motivo;
    orm.fechaRevocacion = domain.fechaRevocacion ?? null;
    orm.createdAt = domain.fechaCreacion;
    return orm;
  }
}
