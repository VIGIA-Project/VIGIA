import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import {
    IVehiculoRepository,
    VEHICULO_REPOSITORY,
} from '../../domain/repositories/vehiculo.repository';
import {
    IPersonaRepository,
    PERSONA_REPOSITORY,
} from '../../domain/repositories/persona.repository';
import {
    CrearVehiculoDto,
    ActualizarVehiculoDto,
    VehiculoResponseDto,
} from '../dtos/vehiculo.dto';
import { Placa } from '../../domain/value-objects/placa.vo';

@Injectable()
export class VehiculoUseCases {
    constructor(
        @Inject(VEHICULO_REPOSITORY)
        private readonly vehiculoRepo: IVehiculoRepository,
        @Inject(PERSONA_REPOSITORY)
        private readonly personaRepo: IPersonaRepository,
    ) {}

    async crear(dto: CrearVehiculoDto): Promise<VehiculoResponseDto> {
        const propietario = await this.personaRepo.findById(dto.propietarioPersonaId);
        if (!propietario) {
            throw new NotFoundException('Propietario no encontrado');
        }

        const placa = Placa.create(dto.placa);

        const existente = await this.vehiculoRepo.findByPlaca(placa.getValue());
        if (existente) {
            throw new ConflictException(`Ya existe un vehículo con placa ${placa.getValue()}`);
        }

        const vehiculo = Vehiculo.create({
            vehiculoId: uuidv4(),
            propietarioPersonaId: dto.propietarioPersonaId,
            placa: placa.getValue(),
            marca: dto.marca,
            modelo: dto.modelo,
            color: dto.color,
            anio: dto.anio,
        });

        const saved = await this.vehiculoRepo.save(vehiculo);
        return this.toResponse(saved);
    }

    async buscarPorId(vehiculoId: string): Promise<VehiculoResponseDto> {
        const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
        return this.toResponse(vehiculo);
    }

    async buscarPorPlaca(placa: string): Promise<VehiculoResponseDto> {
        const placaNormalizada = Placa.create(placa).getValue();
        const vehiculo = await this.vehiculoRepo.findByPlaca(placaNormalizada);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
        return this.toResponse(vehiculo);
    }

    async listar(): Promise<VehiculoResponseDto[]> {
        const vehiculos = await this.vehiculoRepo.findAll();
        return vehiculos.map((v) => this.toResponse(v));
    }

    async contar(): Promise<{ count: number }> {
        const count = await this.vehiculoRepo.contarTotal();
        return { count };
    }

    async listarPorPropietario(propietarioPersonaId: string): Promise<VehiculoResponseDto[]> {
        const vehiculos = await this.vehiculoRepo.findByPropietario(propietarioPersonaId);
        return vehiculos.map((v) => this.toResponse(v));
    }

    async actualizar(
        vehiculoId: string,
        dto: ActualizarVehiculoDto,
    ): Promise<VehiculoResponseDto> {
        const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

        const data: any = { ...dto };
        if (dto.placa) {
            data.placa = Placa.create(dto.placa).getValue();
        }

        const updated = await this.vehiculoRepo.update(vehiculoId, data);
        return this.toResponse(updated);
    }

    async eliminar(vehiculoId: string): Promise<void> {
        const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
        if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
        await this.vehiculoRepo.delete(vehiculoId);
    }

    private toResponse(vehiculo: Vehiculo): VehiculoResponseDto {
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
}