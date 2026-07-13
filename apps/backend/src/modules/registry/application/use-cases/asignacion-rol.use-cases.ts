import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
    AsignacionRol,
    RolAsignacion,
} from '../../domain/entities/asignacion-rol.entity';
import {
    IAsignacionRolRepository,
    ASIGNACION_ROL_REPOSITORY,
} from '../../domain/repositories/asignacion-rol.repository';
import {
    IPersonaRepository,
    PERSONA_REPOSITORY,
} from '../../domain/repositories/persona.repository';
import {
    IVehiculoRepository,
    VEHICULO_REPOSITORY,
} from '../../domain/repositories/vehiculo.repository';
import {
    CrearAsignacionRolDto,
    AsignacionRolResponseDto,
} from '../dtos/asignacion-rol.dto';

@Injectable()
export class AsignacionRolUseCases {
    constructor(
        @Inject(ASIGNACION_ROL_REPOSITORY)
        private readonly asignacionRepo: IAsignacionRolRepository,
        @Inject(PERSONA_REPOSITORY)
        private readonly personaRepo: IPersonaRepository,
        @Inject(VEHICULO_REPOSITORY)
        private readonly vehiculoRepo: IVehiculoRepository,
    ) {}

    async crear(dto: CrearAsignacionRolDto): Promise<AsignacionRolResponseDto> {
        const persona = await this.personaRepo.findById(dto.personaId);
        if (!persona) throw new NotFoundException('Persona no encontrada');

        const vehiculo = await this.vehiculoRepo.findById(dto.vehiculoId);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

        // Solo puede haber un propietario activo por vehículo
        if (dto.rol === RolAsignacion.PROPIETARIO) {
            const propietarios = await this.asignacionRepo.findByVehiculoYRol(
                dto.vehiculoId,
                RolAsignacion.PROPIETARIO,
            );
            if (propietarios.length > 0) {
                throw new ConflictException('El vehículo ya tiene un propietario activo');
            }
        }

        const asignacion = AsignacionRol.create({
            asignacionRolId: uuidv4(),
            personaId: dto.personaId,
            vehiculoId: dto.vehiculoId,
            rol: dto.rol,
            vigenteHasta: dto.vigenteHasta ? new Date(dto.vigenteHasta) : undefined,
        });

        const saved = await this.asignacionRepo.save(asignacion);
        return this.toResponse(saved);
    }

    async listar(): Promise<AsignacionRolResponseDto[]> {
        const asignaciones = await this.asignacionRepo.findAll();
        return asignaciones.map((a) => this.toResponse(a));
    }

    async listarPorVehiculo(vehiculoId: string): Promise<AsignacionRolResponseDto[]> {
        const asignaciones = await this.asignacionRepo.findByVehiculo(vehiculoId);
        return asignaciones.map((a) => this.toResponse(a));
    }

    async listarPorPersona(personaId: string): Promise<AsignacionRolResponseDto[]> {
        const asignaciones = await this.asignacionRepo.findByPersona(personaId);
        return asignaciones.map((a) => this.toResponse(a));
    }

    async consultarGrupoFamiliar(vehiculoId: string): Promise<AsignacionRolResponseDto[]> {
        const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

        const familiares = await this.asignacionRepo.findGrupoFamiliar(vehiculoId);
        return familiares.map((a) => this.toResponse(a));
    }

    async desactivar(asignacionRolId: string): Promise<void> {
        await this.asignacionRepo.desactivar(asignacionRolId);
    }

    private toResponse(asignacion: AsignacionRol): AsignacionRolResponseDto {
        return {
            asignacionRolId: asignacion.asignacionRolId,
            personaId: asignacion.personaId,
            vehiculoId: asignacion.vehiculoId,
            rol: asignacion.rol,
            estadoAsignacion: asignacion.estadoAsignacion,
            vigenteDesde: asignacion.vigentDesde,
            vigenteHasta: asignacion.vigenteHasta,
        };
    }
}