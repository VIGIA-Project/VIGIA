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

  static toOrm(alerta: Alerta): AlertaOrmEntity {
    const orm = new AlertaOrmEntity();
    orm.alertaId = alerta.id;
    orm.causaOrigen = alerta.causaOrigen;
    orm.referenciaOrigenId = alerta.referenciaOrigenId;
    orm.vehiculoId = alerta.vehiculoId ?? null;
    orm.severidad = alerta.severidad;
    orm.estadoAtencion = alerta.estadoAtencion;
    orm.mensajeResumen = alerta.mensajeResumen;
    orm.generadaEn = alerta.generadaEn;
    orm.atendidaEn = alerta.atendidaEn ?? null;
    return orm;
  }
}
