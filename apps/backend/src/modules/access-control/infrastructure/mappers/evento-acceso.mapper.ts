import { EventoAcceso } from '../../domain/entities/evento-acceso.entity';
import { EventoAccesoOrmEntity } from '../entities/evento-acceso.orm-entity';
import { TipoMovimiento, DecisionOperativa, OrigenResolucion } from '../../domain/value-objects/evento-acceso.vo';

export class EventoAccesoMapper {
  static toDomain(orm: EventoAccesoOrmEntity): EventoAcceso {
    return new EventoAcceso(
      orm.id,
      orm.tipoMovimiento as TipoMovimiento,
      orm.decision as DecisionOperativa,
      orm.origenResolucion as OrigenResolucion,
      orm.timestampEvento,
      orm.motivoCodigo,
      orm.vehiculoId || undefined,
      orm.personaId || undefined,
      orm.placaCapturada || undefined,
      orm.motivoDenegacion || undefined,
    );
  }

  static toOrm(domain: EventoAcceso): EventoAccesoOrmEntity {
    const orm = new EventoAccesoOrmEntity();
    orm.id = domain.id;
    orm.tipoMovimiento = domain.tipoMovimiento;
    orm.decision = domain.decision;
    orm.origenResolucion = domain.origenResolucion;
    orm.timestampEvento = domain.timestampEvento;
    orm.motivoCodigo = domain.motivoCodigo;
    orm.vehiculoId = domain.vehiculoId || null;
    orm.personaId = domain.personaId || null;
    orm.placaCapturada = domain.placaCapturada || null;
    orm.motivoDenegacion = domain.motivoDenegacion || null;
    return orm;
  }
}
