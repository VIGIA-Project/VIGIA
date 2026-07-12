import { Alerta } from '../../domain/entities/alerta.entity';
import { SeveridadAlerta } from '../../domain/value-objects/severidad-alerta.vo';
import { EstadoAtencionAlerta } from '../../domain/value-objects/estado-atencion-alerta.vo';
import { AlertaOrmEntity } from '../entities/alerta.orm-entity';

export class AlertaMapper {
  static toDomain(orm: AlertaOrmEntity): Alerta {
    return Alerta.crear({
      id: orm.alertaId,
      causaOrigen: orm.causaOrigen,
      referenciaOrigenId: orm.referenciaOrigenId,
      vehiculoId: orm.vehiculoId ?? undefined,
      severidad: orm.severidad as SeveridadAlerta,
      estadoAtencion: orm.estadoAtencion as EstadoAtencionAlerta,
      mensajeResumen: orm.mensajeResumen,
      generadaEn: orm.generadaEn,
      atendidaEn: orm.atendidaEn ?? undefined,
    });
  }

  static toOrm(domain: Alerta): AlertaOrmEntity {
    const orm = new AlertaOrmEntity();
    orm.alertaId = domain.id;
    orm.causaOrigen = domain.causaOrigen;
    orm.referenciaOrigenId = domain.referenciaOrigenId;
    orm.vehiculoId = domain.vehiculoId ?? null;
    orm.severidad = domain.severidad;
    orm.estadoAtencion = domain.estadoAtencion;
    orm.mensajeResumen = domain.mensajeResumen;
    orm.generadaEn = domain.generadaEn;
    orm.atendidaEn = domain.atendidaEn ?? null;
    return orm;
  }
}
