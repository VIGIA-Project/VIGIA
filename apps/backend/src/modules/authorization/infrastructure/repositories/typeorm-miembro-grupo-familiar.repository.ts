import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMiembroGrupoFamiliarRepository } from '../../domain/repositories/miembro-grupo-familiar.repository';
import { MiembroGrupoFamiliar } from '../../domain/entities/miembro-grupo-familiar.entity';
import { EstadoAutorizacion } from '../../domain/value-objects/estado-autorizacion.vo';
import { MiembroGrupoFamiliarOrmEntity } from '../entities/miembro-grupo-familiar.orm-entity';
import { MiembroGrupoFamiliarMapper } from '../mappers/miembro-grupo-familiar.mapper';

@Injectable()
export class TypeOrmMiembroGrupoFamiliarRepository
  implements IMiembroGrupoFamiliarRepository
{
  constructor(
    @InjectRepository(MiembroGrupoFamiliarOrmEntity)
    private readonly repo: Repository<MiembroGrupoFamiliarOrmEntity>,
  ) {}

  async guardar(miembro: MiembroGrupoFamiliar): Promise<MiembroGrupoFamiliar> {
    const orm = MiembroGrupoFamiliarMapper.toOrm(miembro);
    const saved = await this.repo.save(orm);
    return MiembroGrupoFamiliarMapper.toDomain(saved);
  }

  async buscarPorId(id: string): Promise<MiembroGrupoFamiliar | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? MiembroGrupoFamiliarMapper.toDomain(orm) : null;
  }

  async buscarPorPropietario(propietarioId: string): Promise<MiembroGrupoFamiliar[]> {
    const orms = await this.repo
      .createQueryBuilder('m')
      .where('m.propietario_id = :propietarioId', { propietarioId })
      .orderBy('m.created_at', 'DESC')
      .getMany();
    return orms.map((orm) => MiembroGrupoFamiliarMapper.toDomain(orm));
  }

  async buscarActivosPorPropietario(propietarioId: string): Promise<MiembroGrupoFamiliar[]> {
    const orms = await this.repo
      .createQueryBuilder('m')
      .where('m.propietario_id = :propietarioId', { propietarioId })
      .andWhere('m.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .orderBy('m.created_at', 'DESC')
      .getMany();
    return orms.map((orm) => MiembroGrupoFamiliarMapper.toDomain(orm));
  }

  async contarActivosPorPropietario(propietarioId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('m')
      .where('m.propietario_id = :propietarioId', { propietarioId })
      .andWhere('m.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .getCount();
  }

  async existeMiembroActivo(personaId: string, propietarioId: string): Promise<boolean> {
    const count = await this.repo
      .createQueryBuilder('m')
      .where('m.persona_id = :personaId', { personaId })
      .andWhere('m.propietario_id = :propietarioId', { propietarioId })
      .andWhere('m.estado = :estado', { estado: EstadoAutorizacion.ACTIVA })
      .getCount();
    return count > 0;
  }
}
