// infrastructure/repositories/access-event.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoAccesoOrmEntity } from './access-event.orm-entity';
import {
  IAccessEventRepository,
} from '../../domain/repositories/access-event.repository';
import {
  EventoAcceso, TipoMovimiento, DecisionOperativa, OrigenResolucion,
} from '../../domain/entities/access-event.entity';

@Injectable()
export class AccessEventRepositoryImpl implements IAccessEventRepository {
  constructor(
    @InjectRepository(EventoAccesoOrmEntity)
    private readonly repo: Repository<EventoAccesoOrmEntity>,
  ) {}

  async save(evento: EventoAcceso): Promise<EventoAcceso> {
    const orm = this.toOrm(evento);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<EventoAcceso | null> {
    const orm = await this.repo.findOne({ where: { eventoAccesoId: id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findPendientes(puntoControlId?: string): Promise<EventoAcceso[]> {
    const qb = this.repo.createQueryBuilder('e')
      .where('e.decisionOperativa = :dec', { dec: DecisionOperativa.PENDING_VERIFY })
      .orderBy('e.capturadoEn', 'ASC');
    if (puntoControlId) {
      qb.andWhere('e.puntoControlId = :pci', { pci: puntoControlId });
    }
    const rows = await qb.getMany();
    return rows.map(r => this.toDomain(r));
  }

  async findByPlaca(placa: string, limit = 20): Promise<EventoAcceso[]> {
    const rows = await this.repo.find({
      where: { placaObservada: placa },
      order: { capturadoEn: 'DESC' },
      take: limit,
    });
    return rows.map(r => this.toDomain(r));
  }

  async findByTurno(puntoControlId: string, desde: Date, hasta: Date): Promise<EventoAcceso[]> {
    const rows = await this.repo.createQueryBuilder('e')
      .where('e.puntoControlId = :pci', { pci: puntoControlId })
      .andWhere('e.capturadoEn BETWEEN :desde AND :hasta', { desde, hasta })
      .orderBy('e.capturadoEn', 'DESC')
      .getMany();
    return rows.map(r => this.toDomain(r));
  }

  async update(evento: EventoAcceso): Promise<EventoAcceso> {
    const orm = this.toOrm(evento);
    await this.repo.save(orm);
    return evento;
  }

  private toOrm(e: EventoAcceso): EventoAccesoOrmEntity {
    const orm = new EventoAccesoOrmEntity();
    orm.eventoAccesoId    = e.eventoAccesoId;
    orm.vehiculoId        = e.vehiculoId;
    orm.personaDetectadaId = e.personaDetectadaId;
    orm.placaObservada    = e.placaObservada;
    orm.tipoMovimiento    = e.tipoMovimiento;
    orm.decisionOperativa = e.decisionOperativa;
    orm.motivoCodigo      = e.motivoCodigo;
    orm.motivoDetalle     = e.motivoDetalle;
    orm.origenResolucion  = e.origenResolucion;
    orm.puntoControlId    = e.puntoControlId;
    orm.carril            = e.carril;
    orm.scoreBiometrico   = e.scoreBiometrico;
    orm.umbralAplicado    = e.umbralAplicado;
    orm.evidenciaResumen  = e.evidenciaResumen;
    orm.capturadoEn       = e.capturadoEn;
    orm.resueltoEn        = e.resueltoEn;
    return orm;
  }

  private toDomain(o: EventoAccesoOrmEntity): EventoAcceso {
    return new EventoAcceso(
      o.eventoAccesoId,
      o.placaObservada,
      o.tipoMovimiento,
      o.decisionOperativa,
      o.motivoCodigo,
      o.motivoDetalle,
      o.origenResolucion,
      o.vehiculoId,
      o.personaDetectadaId,
      o.puntoControlId,
      o.carril,
      o.scoreBiometrico ? Number(o.scoreBiometrico) : null,
      Number(o.umbralAplicado),
      o.evidenciaResumen,
      o.capturadoEn,
      o.resueltoEn,
    );
  }
}
