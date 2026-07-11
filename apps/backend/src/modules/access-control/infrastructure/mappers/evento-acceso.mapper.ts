import { EventoAcceso } from '../../domain/entities/evento-acceso.entity';
import { TipoMovimiento } from '../../domain/value-objects/tipo-movimiento.vo';
import { DecisionOperativa } from '../../domain/value-objects/decision-operativa.vo';
import { OrigenResolucion } from '../../domain/value-objects/origen-resolucion.vo';
import { EventoAccesoOrmEntity } from '../entities/evento-acceso.orm-entity';

export class EventoAccesoMapper {
  static toDomain(orm: EventoAccesoOrmEntity): EventoAcceso {
    return EventoAcceso.crear({
      id: orm.eventoAccesoId,
      vehiculoId: orm.vehiculoId ?? undefined,
      personaDetectadaId: orm.personaDetectadaId ?? undefined,
      placaObservada: orm.placaObservada,
      tipoMovimiento: orm.tipoMovimiento as TipoMovimiento,
      decisionOperativa: orm.decisionOperativa as DecisionOperativa,
      motivoCodigo: orm.motivoCodigo,
      motivoDetalle: orm.motivoDetalle ?? undefined,
      origenResolucion: orm.origenResolucion as OrigenResolucion,
      capturadoEn: orm.capturadoEn,
      resueltoEn: orm.resueltoEn ?? undefined,
    });
  }

  static toOrm(domain: EventoAcceso): EventoAccesoOrmEntity {
    const orm = new EventoAccesoOrmEntity();
    orm.eventoAccesoId = domain.id;
    orm.vehiculoId = domain.vehiculoId ?? null;
    orm.personaDetectadaId = domain.personaDetectadaId ?? null;
    orm.placaObservada = domain.placaObservada;
    orm.tipoMovimiento = domain.tipoMovimiento;
    orm.decisionOperativa = domain.decisionOperativa;
    orm.motivoCodigo = domain.motivoCodigo;
    orm.motivoDetalle = domain.motivoDetalle ?? null;
    orm.origenResolucion = domain.origenResolucion;
    orm.capturadoEn = domain.capturadoEn;
    orm.resueltoEn = domain.resueltoEn ?? null;
    return orm;
  }
}
