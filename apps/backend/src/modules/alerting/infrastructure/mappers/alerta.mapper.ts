import { Alerta } from '../../domain/entities/alerta.entity';
import { AlertaOrmEntity } from '../entities/alerta.orm-entity';
import { SeveridadAlerta, EstadoAtencionAlerta } from '../../domain/value-objects/alerta.vo';

export class AlertaMapper {
  static toDomain(orm: AlertaOrmEntity): Alerta {
    return new Alerta(
      orm.id,
      orm.causaOrigen,
      orm.referenciaOrigenId,
      orm.severidad as SeveridadAlerta,
      orm.estadoAtencion as EstadoAtencionAlerta,
      orm.mensajeResumen,
      orm.generadaEn,
      orm.atendidaEn,
      orm.vehiculoId || undefined,
    );
  }

  static toOrm(domain: Alerta): AlertaOrmEntity {
    const orm = new AlertaOrmEntity();
    orm.id = domain.id;
    orm.causaOrigen = domain.causaOrigen;
    orm.referenciaOrigenId = domain.referenciaOrigenId;
    orm.severidad = domain.severidad;
    orm.estadoAtencion = domain.estadoAtencion;
    orm.mensajeResumen = domain.mensajeResumen;
    orm.generadaEn = domain.generadaEn;
    orm.atendidaEn = domain.atendidaEn;
    orm.vehiculoId = domain.vehiculoId || null;
    return orm;
  }
}
