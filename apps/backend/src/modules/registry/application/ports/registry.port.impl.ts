import { Injectable, Inject } from '@nestjs/common';
import { IRegistryPort } from './registry.port';
import {
    IPersonaRepository,
    PERSONA_REPOSITORY,
} from '../../domain/repositories/persona.repository';
import {
    IVehiculoRepository,
    VEHICULO_REPOSITORY,
} from '../../domain/repositories/vehiculo.repository';
import {
    IAsignacionRolRepository,
    ASIGNACION_ROL_REPOSITORY,
} from '../../domain/repositories/asignacion-rol.repository';
import { RolAsignacion } from '../../domain/entities/asignacion-rol.entity';
import { Placa } from '../../domain/value-objects/placa.vo';
import { PersonaResponseDto } from '../dtos/persona.dto';
import { VehiculoResponseDto } from '../dtos/vehiculo.dto';
import { AsignacionRolResponseDto } from '../dtos/asignacion-rol.dto';

@Injectable()
export class RegistryPortImpl implements IRegistryPort {
    constructor(
        @Inject(PERSONA_REPOSITORY)
        private readonly personaRepo: IPersonaRepository,
        @Inject(VEHICULO_REPOSITORY)
        private readonly vehiculoRepo: IVehiculoRepository,
        @Inject(ASIGNACION_ROL_REPOSITORY)
        private readonly asignacionRepo: IAsignacionRolRepository,
    ) {}

    async findVehiculoByPlaca(placa: string): Promise<VehiculoResponseDto | null> {
        try {
            const placaNormalizada = Placa.create(placa).getValue();
            const vehiculo = await this.vehiculoRepo.findByPlaca(placaNormalizada);
            if (!vehiculo) return null;
            return {
                vehiculoId: vehiculo.vehiculoId,
                propietarioPersonaId: vehiculo.propietarioPersonaId,
                placa: vehiculo.placa,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                color: vehiculo.color,
                anio: vehiculo.anio,
                estadoRegistro: vehiculo.estadoRegistro,
                createdAt: vehiculo.createdAt,
            };
        } catch {
            return null;
        }
    }

    async findVehiculoById(vehiculoId: string): Promise<VehiculoResponseDto | null> {
        const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
        if (!vehiculo) return null;
        return {
            vehiculoId: vehiculo.vehiculoId,
            propietarioPersonaId: vehiculo.propietarioPersonaId,
            placa: vehiculo.placa,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            color: vehiculo.color,
            anio: vehiculo.anio,
            estadoRegistro: vehiculo.estadoRegistro,
            createdAt: vehiculo.createdAt,
        };
    }

    async findPersonaById(personaId: string): Promise<PersonaResponseDto | null> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) return null;
        return {
            personaId: persona.personaId,
            identificacionTipo: persona.identificacionTipo,
            identificacionNumero: persona.identificacionNumero,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            nombreCompleto: persona.getNombreCompleto(),
            correoInstitucional: persona.correoInstitucional,
            telefonoContacto: persona.telefonoContacto,
            estadoRegistro: persona.estadoRegistro,
            estadoBiometrico: persona.estadoBiometrico,
            createdAt: persona.createdAt,
        };
    }

    async findPersonaByCorreo(correoInstitucional: string): Promise<PersonaResponseDto | null> {
        const persona = await this.personaRepo.findByCorreo(correoInstitucional);
        if (!persona) return null;
        return {
            personaId: persona.personaId,
            identificacionTipo: persona.identificacionTipo,
            identificacionNumero: persona.identificacionNumero,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            nombreCompleto: persona.getNombreCompleto(),
            correoInstitucional: persona.correoInstitucional,
            telefonoContacto: persona.telefonoContacto,
            estadoRegistro: persona.estadoRegistro,
            estadoBiometrico: persona.estadoBiometrico,
            createdAt: persona.createdAt,
        };
    }

    async findPropietarioByVehiculo(vehiculoId: string): Promise<PersonaResponseDto | null> {
        const propietarios = await this.asignacionRepo.findByVehiculoYRol(
            vehiculoId,
            RolAsignacion.PROPIETARIO,
        );
        if (propietarios.length === 0) return null;
        return this.findPersonaById(propietarios[0].personaId);
    }

    async findPersonasAutorizadasByVehiculo(vehiculoId: string): Promise<AsignacionRolResponseDto[]> {
        const asignaciones = await this.asignacionRepo.findByVehiculo(vehiculoId);
        return asignaciones.map((a) => ({
            asignacionRolId: a.asignacionRolId,
            personaId: a.personaId,
            vehiculoId: a.vehiculoId,
            rol: a.rol,
            estadoAsignacion: a.estadoAsignacion,
            vigenteDesde: a.vigentDesde,
            vigenteHasta: a.vigenteHasta,
        }));
    }

    async findGrupoFamiliarByVehiculo(vehiculoId: string): Promise<AsignacionRolResponseDto[]> {
        const familiares = await this.asignacionRepo.findGrupoFamiliar(vehiculoId);
        return familiares.map((a) => ({
            asignacionRolId: a.asignacionRolId,
            personaId: a.personaId,
            vehiculoId: a.vehiculoId,
            rol: a.rol,
            estadoAsignacion: a.estadoAsignacion,
            vigenteDesde: a.vigentDesde,
            vigenteHasta: a.vigenteHasta,
        }));
    }

    async getEstadoBiometrico(personaId: string): Promise<'PENDIENTE' | 'COMPLETO' | null> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) return null;
        return persona.estadoBiometrico as 'PENDIENTE' | 'COMPLETO';
    }
}