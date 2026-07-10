import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Persona } from '../../domain/entities/persona.entity';
import {
    IPersonaRepository,
    PERSONA_REPOSITORY,
} from '../../domain/repositories/persona.repository';
import {
    CrearPersonaDto,
    ActualizarPersonaDto,
    PersonaResponseDto,
} from '../dtos/persona.dto';

@Injectable()
export class PersonaUseCases {
    constructor(
        @Inject(PERSONA_REPOSITORY)
        private readonly personaRepo: IPersonaRepository,
    ) {}

    async crear(dto: CrearPersonaDto): Promise<PersonaResponseDto> {
        const existente = await this.personaRepo.findByIdentificacion(
            dto.identificacionTipo,
            dto.identificacionNumero,
        );
        if (existente) {
            throw new ConflictException(
                `Ya existe una persona con ${dto.identificacionTipo} ${dto.identificacionNumero}`,
            );
        }

        const persona = Persona.create({
            personaId: uuidv4(),
            identificacionTipo: dto.identificacionTipo,
            identificacionNumero: dto.identificacionNumero,
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            correoInstitucional: dto.correoInstitucional,
            telefonoContacto: dto.telefonoContacto,
            rolInstitucional: dto.rolInstitucional,
        });

        const saved = await this.personaRepo.save(persona);
        return this.toResponse(saved);
    }

    async buscarPorId(personaId: string): Promise<PersonaResponseDto> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) throw new NotFoundException('Persona no encontrada');
        return this.toResponse(persona);
    }

    async listar(): Promise<PersonaResponseDto[]> {
        const personas = await this.personaRepo.findAll();
        return personas.map((p) => this.toResponse(p));
    }

    async listarSinBiometria(): Promise<PersonaResponseDto[]> {
        const personas = await this.personaRepo.findSinBiometria();
        return personas.map((p) => this.toResponse(p));
    }

    async contarPersonas(): Promise<number> {
        return this.personaRepo.countAll();
    }

    async actualizar(
        personaId: string,
        dto: ActualizarPersonaDto,
    ): Promise<PersonaResponseDto> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) throw new NotFoundException('Persona no encontrada');

        const updated = await this.personaRepo.update(personaId, {
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            correoInstitucional: dto.correoInstitucional,
            telefonoContacto: dto.telefonoContacto,
            rolInstitucional: dto.rolInstitucional,
        });
        return this.toResponse(updated);
    }

    async eliminar(personaId: string): Promise<void> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) throw new NotFoundException('Persona no encontrada');
        await this.personaRepo.delete(personaId);
    }

    async marcarEnrollmentCompleto(personaId: string): Promise<PersonaResponseDto> {
        const persona = await this.personaRepo.findById(personaId);
        if (!persona) throw new NotFoundException('Persona no encontrada');
        const updated = await this.personaRepo.update(personaId, {
            estadoBiometrico: 'COMPLETO',
        });
        return this.toResponse(updated);
    }

    private toResponse(persona: Persona): PersonaResponseDto {
        return {
            personaId: persona.personaId,
            identificacionTipo: persona.identificacionTipo,
            identificacionNumero: persona.identificacionNumero,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            nombreCompleto: persona.getNombreCompleto(),
            correoInstitucional: persona.correoInstitucional,
            telefonoContacto: persona.telefonoContacto,
            rolInstitucional: persona.rolInstitucional,
            estadoRegistro: persona.estadoRegistro,
            estadoBiometrico: persona.estadoBiometrico,
            createdAt: persona.createdAt,
        };
    }
}