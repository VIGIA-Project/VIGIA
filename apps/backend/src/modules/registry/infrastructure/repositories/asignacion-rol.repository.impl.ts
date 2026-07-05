import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    AsignacionRol,
    RolAsignacion,
    EstadoAsignacion,
} from '../../domain/entities/asignacion-rol.entity';
import { IAsignacionRolRepository } from '../../domain/repositories/asignacion-rol.repository';
import { AsignacionRolOrmEntity } from './asignacion-rol.orm-entity';

@Injectable()
export class AsignacionRolRepositoryImpl implements IAsignacionRolRepository {
    constructor(
        @InjectRepository(AsignacionRolOrmEntity)
        private readonly repo: Repository<AsignacionRolOrmEntity>,
    ) {}

    async save(asignacion: AsignacionRol): Promise<AsignacionRol> {
        const orm = this.repo.create({
            asignacionRolId: asignacion.asignacionRolId,
            personaId: asignacion.personaId,
            vehiculoId: asignacion.vehiculoId,
            rol: asignacion.rol,
            estadoAsignacion: asignacion.estadoAsignacion,
            vigenteDesde: asignacion.vigentDesde,
            vigenteHasta: asignacion.vigenteHasta ?? null,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findByVehiculo(vehiculoId: string): Promise<AsignacionRol[]> {
        const orms = await this.repo.find({
            where: { vehiculoId, estadoAsignacion: 'ACTIVA' as any },
        });
        return orms.map((orm) => this.toDomain(orm));
    }

    async findByPersona(personaId: string): Promise<AsignacionRol[]> {
        const orms = await this.repo.find({
            where: { personaId, estadoAsignacion: 'ACTIVA' as any },
        });
        return orms.map((orm) => this.toDomain(orm));
    }

    async findByVehiculoYRol(
        vehiculoId: string,
        rol: RolAsignacion,
    ): Promise<AsignacionRol[]> {
        const orms = await this.repo.find({
            where: { vehiculoId, rol: rol as any, estadoAsignacion: 'ACTIVA' as any },
        });
        return orms.map((orm) => this.toDomain(orm));
    }

    async findGrupoFamiliar(vehiculoId: string): Promise<AsignacionRol[]> {
        const orms = await this.repo.find({
            where: {
                vehiculoId,
                rol: RolAsignacion.FAMILIAR_AUTORIZADO as any,
                estadoAsignacion: 'ACTIVA' as any,
            },
        });
        return orms.map((orm) => this.toDomain(orm));
    }

    async desactivar(asignacionRolId: string): Promise<void> {
        await this.repo
            .createQueryBuilder()
            .update(AsignacionRolOrmEntity)
            .set({ estadoAsignacion: 'INACTIVA' })
            .where('asignacion_rol_id = :asignacionRolId', { asignacionRolId })
            .execute();
    }

    private toDomain(orm: AsignacionRolOrmEntity): AsignacionRol {
        return AsignacionRol.create({
            asignacionRolId: orm.asignacionRolId,
            personaId: orm.personaId,
            vehiculoId: orm.vehiculoId,
            rol: orm.rol as RolAsignacion,
            estadoAsignacion: orm.estadoAsignacion as EstadoAsignacion,
            vigenteDesde: orm.vigenteDesde,
            vigenteHasta: orm.vigenteHasta ?? undefined,
        });
    }
}