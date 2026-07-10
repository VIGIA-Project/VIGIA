import {
    Injectable,
    Inject,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    IUserRepository,
    USER_REPOSITORY,
    UserFilters,
    PaginatedUsers,
} from '../domain/user.repository';
import { User, UserRole, UserStatus } from '../domain/user.entity';

export interface LoginResult {
    access_token: string;
    must_change_password: boolean;
    role: UserRole;
    biometric_registered: boolean;
    vehicle_registered: boolean;
}

export interface UserResponseDto {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    mustChangePassword: boolean;
    personaId?: string;
    biometricRegistered: boolean;
    vehicleRegistered: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedUsersResponseDto {
    data: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async login(email: string, password: string): Promise<LoginResult> {
        if (!email.endsWith('@uce.edu.ec')) {
            throw new UnauthorizedException(
                'Solo se permiten correos institucionales @uce.edu.ec',
            );
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.isActive()) {
            throw new UnauthorizedException('Usuario inactivo o deshabilitado');
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.email.split('@')[0],
            mustChangePassword: user.mustChangePassword,
            personaId: user.personaId,
        };

        return {
            access_token: this.jwtService.sign(payload),
            must_change_password: user.mustChangePassword,
            role: user.role,
            biometric_registered: user.biometricRegistered,
            vehicle_registered: user.vehicleRegistered,
        };
    }

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Contraseña actual incorrecta');

        if (newPassword.length < 8) {
            throw new BadRequestException(
                'La nueva contraseña debe tener al menos 8 caracteres',
            );
        }

        const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const newHash = await bcrypt.hash(newPassword, rounds);

        await this.userRepository.update(userId, {
            passwordHash: newHash,
            mustChangePassword: false,
        });
    }

    async createUser(
        email: string,
        role: UserRole,
        temporaryPassword: string,
        personaId?: string,
        createdBy?: string,
    ): Promise<UserResponseDto> {
        if (!email.endsWith('@uce.edu.ec')) {
            throw new BadRequestException(
                'Solo se permiten correos institucionales @uce.edu.ec',
            );
        }

        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new ConflictException('Ya existe un usuario con ese correo');
        }

        const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(temporaryPassword, rounds);

        const user = User.create({
            id: uuidv4(),
            email,
            passwordHash,
            role,
            status: UserStatus.PENDING_PASSWORD_CHANGE,
            mustChangePassword: true,
            personaId,
        });

        const saved = await this.userRepository.save(user);
        return this.toResponse(saved);
    }

    async updateOnboardingStatus(
        userId: string,
        data: { biometric_registered?: boolean; vehicle_registered?: boolean },
    ): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const updated = await this.userRepository.update(userId, {
            biometricRegistered: data.biometric_registered,
            vehicleRegistered: data.vehicle_registered,
        });
        return this.toResponse(updated);
    }

    async findById(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return this.toResponse(user);
    }

    async findAll(filters?: UserFilters): Promise<PaginatedUsersResponseDto> {
        const result = await this.userRepository.findAll(filters);
        return {
            data: result.data.map((u) => this.toResponse(u)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    async activateUser(userId: string, updatedBy?: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.userRepository.update(userId, {
            status: UserStatus.ACTIVE,
            updatedBy,
        });
    }

    async deactivateUser(userId: string, updatedBy?: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.userRepository.update(userId, {
            status: UserStatus.INACTIVE,
            updatedBy,
        });
    }

    async resetPassword(userId: string, updatedBy?: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const tempPassword = this.generateSecurePassword();
        const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(tempPassword, rounds);

        await this.userRepository.update(userId, {
            passwordHash,
            mustChangePassword: true,
            status: UserStatus.PENDING_PASSWORD_CHANGE,
            updatedBy,
        });

        return tempPassword;
    }

    private generateSecurePassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    private toResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            mustChangePassword: user.mustChangePassword,
            personaId: user.personaId,
            biometricRegistered: user.biometricRegistered,
            vehicleRegistered: user.vehicleRegistered,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}