import { PaseAccesoRapido } from '../../domain/entities/pase-acceso-rapido.entity';
import { EstadoPase } from '../../domain/value-objects/estado-pase.vo';
import { Vigencia } from '../../domain/value-objects/vigencia.vo';
import { PaseAccesoRapidoOrmEntity } from '../entities/pase-acceso-rapido.orm-entity';

export class PaseAccesoRapidoMapper {
  static toDomain(orm: PaseAccesoRapidoOrmEntity): PaseAccesoRapido {
    return PaseAccesoRapido.crear({
      id: orm.id,
      vehiculoId: orm.vehiculoId,
      propietarioId: orm.propietarioId,
      placa: orm.placa,
      codigoHash: orm.codigoHash,
      vigencia: Vigencia.crear(orm.vigenciaInicio, orm.vigenciaFin),
      nombreVisitante: orm.nombreVisitante,
      cedulaVisitante: orm.cedulaVisitante ?? '',
      motivo: orm.motivo,
      estado: orm.estado as EstadoPase,
      fechaCreacion: orm.createdAt,
      fechaConsumo: orm.fechaConsumo ?? undefined,
      eventoConsumoId: orm.eventoConsumoId ?? undefined,
    });
  }

  static toOrm(domain: PaseAccesoRapido): PaseAccesoRapidoOrmEntity {
    const orm = new PaseAccesoRapidoOrmEntity();
    orm.id = domain.id;
    orm.vehiculoId = domain.vehiculoId;
    orm.propietarioId = domain.propietarioId;
    orm.placa = domain.placa;
    orm.codigoHash = domain.codigoHash;
    orm.estado = domain.estado;
    orm.vigenciaInicio = domain.vigencia.inicio;
    orm.vigenciaFin = domain.vigencia.fin;
    orm.nombreVisitante = domain.nombreVisitante;
    orm.cedulaVisitante = domain.cedulaVisitante || null;
    orm.motivo = domain.motivo;
    orm.fechaConsumo = domain.fechaConsumo ?? null;
    orm.eventoConsumoId = domain.eventoConsumoId ?? null;
    orm.createdAt = domain.fechaCreacion;
    return orm;
  }
}
