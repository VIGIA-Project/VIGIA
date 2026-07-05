import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PersonaUseCases } from './persona.use-cases';
import { PERSONA_REPOSITORY } from '../../domain/repositories/persona.repository';
import {
    Persona,
    IdentificacionTipo,
    EstadoRegistro,
    EstadoBiometrico,
} from '../../domain/entities/persona.entity';

const mockPersona = Persona.create({
    personaId: 'test-uuid-001',
    identificacionTipo: IdentificacionTipo.CEDULA,
    identificacionNumero: '1700000099',
    nombres: 'Kevin',
    apellidos: 'Chicaisa',
    correoInstitucional: 'kevin@uce.edu.ec',
});

const mockPersonaRepo = {
    save: jest.fn(),
    findById: jest.fn(),
    findByIdentificacion: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('PersonaUseCases', () => {
    let personaUseCases: PersonaUseCases;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PersonaUseCases,
                { provide: PERSONA_REPOSITORY, useValue: mockPersonaRepo },
            ],
        }).compile();

        personaUseCases = module.get<PersonaUseCases>(PersonaUseCases);
        jest.clearAllMocks();
    });

    describe('crear', () => {
        it('debe crear persona correctamente con enrollment PENDIENTE', async () => {
            mockPersonaRepo.findByIdentificacion.mockResolvedValue(null);
            mockPersonaRepo.save.mockResolvedValue(mockPersona);

            const result = await personaUseCases.crear({
                identificacionTipo: IdentificacionTipo.CEDULA,
                identificacionNumero: '1700000099',
                nombres: 'Kevin',
                apellidos: 'Chicaisa',
            });

            expect(result.estadoBiometrico).toBe(EstadoBiometrico.PENDIENTE);
            expect(mockPersonaRepo.save).toHaveBeenCalled();
        });

        it('debe lanzar ConflictException si la persona ya existe', async () => {
            mockPersonaRepo.findByIdentificacion.mockResolvedValue(mockPersona);

            await expect(
                personaUseCases.crear({
                    identificacionTipo: IdentificacionTipo.CEDULA,
                    identificacionNumero: '1700000099',
                    nombres: 'Kevin',
                    apellidos: 'Chicaisa',
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('buscarPorId', () => {
        it('debe retornar persona cuando existe', async () => {
            mockPersonaRepo.findById.mockResolvedValue(mockPersona);

            const result = await personaUseCases.buscarPorId('test-uuid-001');

            expect(result.personaId).toBe('test-uuid-001');
            expect(result.nombreCompleto).toBe('Kevin Chicaisa');
        });

        it('debe lanzar NotFoundException si no existe', async () => {
            mockPersonaRepo.findById.mockResolvedValue(null);

            await expect(
                personaUseCases.buscarPorId('no-existe'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('marcarEnrollmentCompleto', () => {
        it('debe marcar enrollment como COMPLETO', async () => {
            const personaConEnrollment = Persona.create({
                ...mockPersona,
                personaId: 'test-uuid-001',
                estadoBiometrico: EstadoBiometrico.COMPLETO,
            });

            mockPersonaRepo.findById.mockResolvedValue(mockPersona);
            mockPersonaRepo.update.mockResolvedValue(personaConEnrollment);

            const result = await personaUseCases.marcarEnrollmentCompleto('test-uuid-001');

            expect(mockPersonaRepo.update).toHaveBeenCalledWith(
                'test-uuid-001',
                { estadoBiometrico: 'COMPLETO' },
            );
        });

        it('debe lanzar NotFoundException si la persona no existe', async () => {
            mockPersonaRepo.findById.mockResolvedValue(null);

            await expect(
                personaUseCases.marcarEnrollmentCompleto('no-existe'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('eliminar', () => {
        it('debe eliminar persona existente', async () => {
            mockPersonaRepo.findById.mockResolvedValue(mockPersona);
            mockPersonaRepo.delete.mockResolvedValue(undefined);

            await expect(
                personaUseCases.eliminar('test-uuid-001'),
            ).resolves.not.toThrow();
        });

        it('debe lanzar NotFoundException si no existe', async () => {
            mockPersonaRepo.findById.mockResolvedValue(null);

            await expect(
                personaUseCases.eliminar('no-existe'),
            ).rejects.toThrow(NotFoundException);
        });
    });
});