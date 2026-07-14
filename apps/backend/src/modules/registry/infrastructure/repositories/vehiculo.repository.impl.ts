import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo, } from '../../domain/entities/vehiculo.entity';
import { EstadoRegistro } from '../../domain/entities/persona.entity';
import { IVehiculoRepository } from '../../domain/repositories/vehiculo.repository';
import { VehiculoOrmEntity } from './vehiculo.orm-entity';

@Injectable()
export class VehiculoRepositoryImpl implements IVehiculoRepository {
    constructor(
        @InjectRepository(VehiculoOrmEntity)
        private readonly repo: Repository<VehiculoOrmEntity>,
    ) {}

    async save(vehiculo: Vehiculo): Promise<Vehiculo> {
        const orm = this.repo.create({
            vehiculoId: vehiculo.vehiculoId,
            propietarioPersonaId: vehiculo.propietarioPersonaId,
            placa: vehiculo.placa,
            marca: vehiculo.marca ?? null,
            modelo: vehiculo.modelo ?? null,
            color: vehiculo.color ?? null,
            anio: vehiculo.anio ?? null,
            estadoRegistro: vehiculo.estadoRegistro,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(vehiculoId: string): Promise<Vehiculo | null> {
        const orm = await this.repo
            .createQueryBuilder('v')
            .where('v.vehiculo_id = :vehiculoId', { vehiculoId })
            .getOne();
        return orm ? this.toDomain(orm) : null;
    }

    async findByPlaca(placa: string): Promise<Vehiculo | null> {
        const orm = await this.repo.findOne({ where: { placa } });
        return orm ? this.toDomain(orm) : null;
    }

    async findByPropietario(propietarioPersonaId: string): Promise<Vehiculo[]> {
        const orms = await this.repo.find({ where: { propietarioPersonaId } });
        return orms.map((orm) => this.toDomain(orm));
    }

    async findAll(): Promise<Vehiculo[]> {
        const orms = await this.repo.find();
        return orms.map((orm) => this.toDomain(orm));
    }

    async contarTotal(): Promise<number> {
        return this.repo.count();
    }

    async update(
        vehiculoId: string,
        data: Partial<{
            placa: string;
            marca: string;
            modelo: string;
            color: string;
            anio: number;
            estadoRegistro: string;
        }>,
    ): Promise<Vehiculo> {
        await this.repo
            .createQueryBuilder()
            .update(VehiculoOrmEntity)
            .set(data)
            .where('vehiculo_id = :vehiculoId', { vehiculoId })
            .execute();
        const updated = await this.findById(vehiculoId);
        if (!updated) throw new Error('Vehículo no encontrado después de update');
        return updated;
    }

    async delete(vehiculoId: string): Promise<void> {
        await this.repo
            .createQueryBuilder()
            .update(VehiculoOrmEntity)
            .set({ estadoRegistro: 'INACTIVO' })
            .where('vehiculo_id = :vehiculoId', { vehiculoId })
            .execute();
    }

    private toDomain(orm: VehiculoOrmEntity): Vehiculo {
        return Vehiculo.create({
            vehiculoId: orm.vehiculoId,
            propietarioPersonaId: orm.propietarioPersonaId,
            placa: orm.placa,
            marca: orm.marca ?? undefined,
            modelo: orm.modelo ?? undefined,
            color: orm.color ?? undefined,
            anio: orm.anio ?? undefined,
            estadoRegistro: orm.estadoRegistro as EstadoRegistro,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }
}