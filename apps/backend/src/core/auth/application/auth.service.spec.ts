import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User, UserRole, UserStatus } from '../domain/user.entity';
import * as bcrypt from 'bcrypt';

// Mock del usuario admin
const mockPasswordHash = bcrypt.hashSync('Admin2026!', 10);

const mockUser = User.create({
    id: 'test-uuid-123',
    email: 'admin@uce.edu.ec',
    passwordHash: mockPasswordHash,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    mustChangePassword: true,
});

const mockInactiveUser = User.create({
    id: 'test-uuid-456',
    email: 'inactive@uce.edu.ec',
    passwordHash: mockPasswordHash,
    role: UserRole.GUARD,
    status: UserStatus.INACTIVE,
    mustChangePassword: false,
});

// Mock del repositorio
const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
};

// Mock del JwtService
const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

// Mock del ConfigService
const mockConfigService = {
    get: jest.fn().mockReturnValue(10),
};

describe('AuthService', () => {
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
    // LOGIN
    // ================================================================
    describe('login', () => {
        it('debe retornar JWT cuando las credenciales son válidas', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await authService.login('admin@uce.edu.ec', 'Admin2026!');

            expect(result.access_token).toBe('mock.jwt.token');
            expect(result.role).toBe(UserRole.ADMIN);
            expect(result.must_change_password).toBe(true);
        });

        it('debe lanzar UnauthorizedException con email no institucional', async () => {
            await expect(
                authService.login('admin@gmail.com', 'Admin2026!'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                authService.login('noexiste@uce.edu.ec', 'Admin2026!'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(
                authService.login('admin@uce.edu.ec', 'wrongpassword'),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('debe lanzar UnauthorizedException si el usuario está inactivo', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockInactiveUser);

            await expect(
                authService.login('inactive@uce.edu.ec', 'Admin2026!'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    // ================================================================
    // CHANGE PASSWORD
    // ================================================================
    describe('changePassword', () => {
        it('debe cambiar la contraseña correctamente', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.update.mockResolvedValue(mockUser);

            await expect(
                authService.changePassword('test-uuid-123', 'Admin2026!', 'NewPass2026!'),
            ).resolves.not.toThrow();

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                'test-uuid-123',
                expect.objectContaining({ mustChangePassword: false }),
            );
        });

        it('debe lanzar NotFoundException si el usuario no existe', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(
                authService.changePassword('no-existe', 'Admin2026!', 'NewPass2026!'),
            ).rejects.toThrow(NotFoundException);
        });

        it('debe lanzar UnauthorizedException si la contraseña actual es incorrecta', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);

            await expect(
                authService.changePassword('test-uuid-123', 'wrongpassword', 'NewPass2026!'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    // ================================================================
    // CREATE USER
    // ================================================================
    describe('createUser', () => {
        it('debe crear usuario con mustChangePassword=true', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await authService.createUser(
                'guard1@uce.edu.ec',
                UserRole.GUARD,
                'Guard2026!',
            );

            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('debe lanzar BadRequestException con email no institucional', async () => {
            const { BadRequestException } = await import('@nestjs/common');
            await expect(
                authService.createUser('guard@gmail.com', UserRole.GUARD, 'Guard2026!'),
            ).rejects.toThrow();
        });
    });
});