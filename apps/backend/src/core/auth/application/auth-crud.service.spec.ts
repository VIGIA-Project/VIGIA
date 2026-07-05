import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User, UserRole, UserStatus } from '../domain/user.entity';
import * as bcrypt from 'bcrypt';

const mockPasswordHash = bcrypt.hashSync('Admin2026!', 10);

const mockAdmin = User.create({
    id: 'admin-uuid-001',
    email: 'admin@uce.edu.ec',
    passwordHash: mockPasswordHash,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    mustChangePassword: false,
});

const mockGuard = User.create({
    id: 'guard-uuid-001',
    email: 'guard1@uce.edu.ec',
    passwordHash: mockPasswordHash,
    role: UserRole.GUARD,
    status: UserStatus.ACTIVE,
    mustChangePassword: true,
});

const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

const mockConfigService = {
    get: jest.fn().mockReturnValue(10),
};

describe('AuthService — CRUD de cuentas (VIG-126)', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: USER_REPOSITORY, useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    // ================================================================
    // CREAR CUENTA
    // ================================================================
    describe('createUser', () => {
        it('debe crear cuenta con status PENDING_PASSWORD_CHANGE y mustChangePassword=true', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.save.mockResolvedValue(mockGuard);

            const result = await authService.createUser(
                'guard2@uce.edu.ec',
                UserRole.GUARD,
                'Temporal2026!',
                undefined,
                'admin-uuid-001',
            );

            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result.mustChangePassword).toBe(true);
        });

        it('debe lanzar ConflictException si el email ya existe', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockGuard);

            await expect(
                authService.createUser('guard1@uce.edu.ec', UserRole.GUARD, 'Temp2026!'),
            ).rejects.toThrow(ConflictException);
        });

        it('no debe exponer password_hash en la respuesta', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.save.mockResolvedValue(mockGuard);

            const result = await authService.createUser(
                'guard2@uce.edu.ec',
                UserRole.GUARD,
                'Temp2026!',
            );

            expect(result).not.toHaveProperty('passwordHash');
            expect(result).not.toHaveProperty('password_hash');
        });
    });

    // ================================================================
    // LISTAR CUENTAS
    // ================================================================
    describe('findAll', () => {
        it('debe retornar lista paginada de usuarios', async () => {
            mockUserRepository.findAll.mockResolvedValue({
                data: [mockAdmin, mockGuard],
                total: 2,
                page: 1,
                limit: 20,
                totalPages: 1,
            });

            const result = await authService.findAll({ page: 1, limit: 20 });

            expect(result.total).toBe(2);
            expect(result.data).toHaveLength(2);
            expect(result.totalPages).toBe(1);
        });

        it('debe filtrar por rol', async () => {
            mockUserRepository.findAll.mockResolvedValue({
                data: [mockGuard],
                total: 1,
                page: 1,
                limit: 20,
                totalPages: 1,
            });

            const result = await authService.findAll({ role: UserRole.GUARD });

            expect(result.total).toBe(1);
            expect(mockUserRepository.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ role: UserRole.GUARD }),
            );
        });

        it('no debe exponer password_hash en ningún item', async () => {
            mockUserRepository.findAll.mockResolvedValue({
                data: [mockAdmin, mockGuard],
                total: 2,
                page: 1,
                limit: 20,
                totalPages: 1,
            });

            const result = await authService.findAll();

            result.data.forEach((user) => {
                expect(user).not.toHaveProperty('passwordHash');
            });
        });
    });

    // ================================================================
    // DETALLE
    // ================================================================
    describe('findById', () => {
        it('debe retornar detalle de usuario sin password_hash', async () => {
            mockUserRepository.findById.mockResolvedValue(mockAdmin);

            const result = await authService.findById('admin-uuid-001');

            expect(result.id).toBe('admin-uuid-001');
            expect(result).not.toHaveProperty('passwordHash');
        });

        it('debe lanzar NotFoundException si no existe', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(authService.findById('no-existe')).rejects.toThrow(NotFoundException);
        });
    });

    // ================================================================
    // ACTIVAR / DESACTIVAR
    // ================================================================
    describe('activateUser', () => {
        it('debe activar usuario y registrar updatedBy', async () => {
            mockUserRepository.findById.mockResolvedValue(mockGuard);
            mockUserRepository.update.mockResolvedValue(mockGuard);

            await authService.activateUser('guard-uuid-001', 'admin-uuid-001');

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                'guard-uuid-001',
                expect.objectContaining({
                    status: UserStatus.ACTIVE,
                    updatedBy: 'admin-uuid-001',
                }),
            );
        });
    });

    describe('deactivateUser', () => {
        it('debe desactivar usuario y registrar updatedBy', async () => {
            mockUserRepository.findById.mockResolvedValue(mockGuard);
            mockUserRepository.update.mockResolvedValue(mockGuard);

            await authService.deactivateUser('guard-uuid-001', 'admin-uuid-001');

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                'guard-uuid-001',
                expect.objectContaining({
                    status: UserStatus.INACTIVE,
                    updatedBy: 'admin-uuid-001',
                }),
            );
        });
    });

    // ================================================================
    // RESET PASSWORD
    // ================================================================
    describe('resetPassword', () => {
        it('debe generar contraseña temporal de 12 caracteres', async () => {
            mockUserRepository.findById.mockResolvedValue(mockGuard);
            mockUserRepository.update.mockResolvedValue(mockGuard);

            const tempPassword = await authService.resetPassword('guard-uuid-001', 'admin-uuid-001');

            expect(tempPassword).toHaveLength(12);
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                'guard-uuid-001',
                expect.objectContaining({
                    mustChangePassword: true,
                    status: UserStatus.PENDING_PASSWORD_CHANGE,
                    updatedBy: 'admin-uuid-001',
                }),
            );
        });

        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(
                authService.resetPassword('no-existe', 'admin-uuid-001'),
            ).rejects.toThrow(NotFoundException);
        });
    });
});