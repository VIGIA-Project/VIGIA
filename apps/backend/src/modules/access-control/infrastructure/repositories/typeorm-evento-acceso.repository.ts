import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { IEventoAccesoRepository } from '../../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../../domain/entities/evento-acceso.entity';
import { EventoAccesoOrmEntity } from '../entities/evento-acceso.orm-entity';
import { EventoAccesoMapper } from '../mappers/evento-acceso.mapper';

@Injectable()
export class TypeOrmEventoAccesoRepository implements IEventoAccesoRepository {
  constructor(
    @InjectRepository(EventoAccesoOrmEntity)
    private readonly repo: Repository<EventoAccesoOrmEntity>,
  ) {}

  async guardar(evento: EventoAcceso): Promise<EventoAcceso> {
    const orm = EventoAccesoMapper.toOrm(evento);
    const saved = await this.repo.save(orm);
    return EventoAccesoMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<EventoAcceso | null> {
    const orm = await this.repo.findOne({ where: { eventoAccesoId: id } });
    return orm ? EventoAccesoMapper.toDomain(orm) : null;
  }

  async buscarRecientes(limite: number): Promise<EventoAcceso[]> {
    const orms = await this.repo.find({
      order: { capturadoEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => EventoAccesoMapper.toDomain(orm));
  }

  async buscarPorVehiculo(vehiculoId: string, limite: number): Promise<EventoAcceso[]> {
    const orms = await this.repo.find({
      where: { vehiculoId },
      order: { capturadoEn: 'DESC' },
      take: limite,
    });
    return orms.map((orm) => EventoAccesoMapper.toDomain(orm));
  }

  async contarPorRangoFecha(desde: Date, hasta: Date): Promise<number> {
    return this.repo.count({
      where: { capturadoEn: Between(desde, hasta) },
    });
  }

  async buscarInvitadosActivos(): Promise<EventoAcceso[]> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    const orms = await this.repo
      .createQueryBuilder('e')
      .where('e.tipo_movimiento = :entrada', { entrada: 'ENTRADA' })
      .andWhere('e.decision_operativa = :aprobado', { aprobado: 'SUCCESSFUL' })
      .andWhere('e.motivo_codigo = :contingencia', { contingencia: 'CONTINGENCIA' })
      .andWhere('e.capturado_en >= :inicioDia', { inicioDia })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(EventoAccesoOrmEntity, 's')
          .where('s.placa_observada = e.placa_observada')
          .andWhere('s.tipo_movimiento = :salida')
          .andWhere('s.capturado_en > e.capturado_en')
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .setParameter('salida', 'SALIDA')
      .orderBy('e.capturado_en', 'DESC')
      .getMany();

    return orms.map((orm) => EventoAccesoMapper.toDomain(orm));
  }
}
