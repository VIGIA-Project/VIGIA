import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Persona,
    EstadoRegistro,
    IdentificacionTipo,
    EstadoBiometrico,
} from '../../domain/entities/persona.entity';
import { IPersonaRepository } from '../../domain/repositories/persona.repository';
import { PersonaOrmEntity } from './persona.orm-entity';

@Injectable()
export class PersonaRepositoryImpl implements IPersonaRepository {
    constructor(
        @InjectRepository(PersonaOrmEntity)
        private readonly repo: Repository<PersonaOrmEntity>,
    ) {}

    async save(persona: Persona): Promise<Persona> {
        const orm = this.repo.create({
            personaId: persona.personaId,
            identificacionTipo: persona.identificacionTipo,
            identificacionNumero: persona.identificacionNumero,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            correoInstitucional: persona.correoInstitucional ?? null,
            telefonoContacto: persona.telefonoContacto ?? null,
            rolInstitucional: persona.rolInstitucional ?? null,
            estadoRegistro: persona.estadoRegistro,
            estadoBiometrico: persona.estadoBiometrico,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(personaId: string): Promise<Persona | null> {
        const orm = await this.repo
            .createQueryBuilder('p')
            .where('p.persona_id = :personaId', { personaId })
            .getOne();
        return orm ? this.toDomain(orm) : null;
    }

    async findByIdentificacion(
        tipo: string,
        numero: string,
    ): Promise<Persona | null> {
        const orm = await this.repo.findOne({
            where: {
                identificacionTipo: tipo as any,
                identificacionNumero: numero,
            },
        });
        return orm ? this.toDomain(orm) : null;
    }

    async findAll(): Promise<Persona[]> {
        const orms = await this.repo.find();
        return orms.map((orm) => this.toDomain(orm));
    }

    async findSinBiometria(): Promise<Persona[]> {
        const orms = await this.repo.find({
            where: { estadoBiometrico: 'PENDIENTE' },
            take: 150, // To avoid pulling thousands of rows if many exist
        });
        return orms.map((orm) => this.toDomain(orm));
    }

    async countAll(): Promise<number> {
        return this.repo.count();
    }

    async update(
        personaId: string,
        data: Partial<{
            nombres: string;
            apellidos: string;
            correoInstitucional: string;
            telefonoContacto: string;
            rolInstitucional: string;
            estadoRegistro: string;
            estadoBiometrico: string;
        }>,
    ): Promise<Persona> {
        await this.repo
            .createQueryBuilder()
            .update(PersonaOrmEntity)
            .set(data)
            .where('persona_id = :personaId', { personaId })
            .execute();
        const updated = await this.findById(personaId);
        if (!updated) throw new Error('Persona no encontrada después de update');
        return updated;
    }

    async delete(personaId: string): Promise<void> {
        await this.repo
            .createQueryBuilder()
            .update(PersonaOrmEntity)
            .set({ estadoRegistro: 'INACTIVO' })
            .where('persona_id = :personaId', { personaId })
            .execute();
    }

    private toDomain(orm: PersonaOrmEntity): Persona {
        return Persona.create({
            personaId: orm.personaId,
            identificacionTipo: orm.identificacionTipo as IdentificacionTipo,
            identificacionNumero: orm.identificacionNumero,
            nombres: orm.nombres,
            apellidos: orm.apellidos,
            correoInstitucional: orm.correoInstitucional ?? undefined,
            telefonoContacto: orm.telefonoContacto ?? undefined,
            rolInstitucional: orm.rolInstitucional ?? undefined,
            estadoRegistro: orm.estadoRegistro as EstadoRegistro,
            estadoBiometrico: orm.estadoBiometrico as EstadoBiometrico,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }
}