import { PaseGarita, EstadoPaseGarita } from '../../domain/entities/pase-garita.entity';
import { PaseGaritaOrmEntity } from '../entities/pase-garita.orm-entity';
import { TipoMovimiento } from '../../domain/value-objects/evento-acceso.vo';

export class PaseGaritaMapper {
  static toDomain(orm: PaseGaritaOrmEntity): PaseGarita {
    return new PaseGarita(
      orm.id,
      orm.placaVehiculo,
      orm.tipoMovimiento as TipoMovimiento,
      orm.tipoVisitante,
      orm.nombreVisitante,
      orm.documentoVisitante || '',
      orm.destino,
      Number(orm.duracionHoras),
      orm.descripcion || '',
      orm.estado as EstadoPaseGarita,
      orm.guardiaId,
      orm.createdAt,
      orm.finalizadoAt,
    );
  }

  static toOrm(domain: PaseGarita): PaseGaritaOrmEntity {
    const orm = new PaseGaritaOrmEntity();
    orm.id = domain.id;
    orm.placaVehiculo = domain.placaVehiculo;
    orm.tipoMovimiento = domain.tipoMovimiento;
    orm.tipoVisitante = domain.tipoVisitante;
    orm.nombreVisitante = domain.nombreVisitante;
    orm.documentoVisitante = domain.documentoVisitante || null;
    orm.destino = domain.destino;
    orm.duracionHoras = domain.duracionHoras;
    orm.descripcion = domain.descripcion || null;
    orm.estado = domain.estado;
    orm.guardiaId = domain.guardiaId;
    orm.createdAt = domain.createdAt;
    orm.finalizadoAt = domain.finalizadoAt;
    return orm;
  }
}
