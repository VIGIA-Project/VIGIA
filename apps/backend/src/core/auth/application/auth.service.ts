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
import { IUserRepository, USER_REPOSITORY } from '../domain/user.repository';
import { User, UserRole, UserStatus } from '../domain/user.entity';

export interface LoginResult {
    access_token: string;
    must_change_password: boolean;
    role: UserRole;
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
        };

        return {
            access_token: this.jwtService.sign(payload),
            must_change_password: user.mustChangePassword,
            role: user.role,
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
    ): Promise<User> {
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
            status: UserStatus.ACTIVE,
            mustChangePassword: true,
            personaId,
        });

        return this.userRepository.save(user);
    }

    async activateUser(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.userRepository.update(userId, { status: UserStatus.ACTIVE });
    }

    async deactivateUser(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.userRepository.update(userId, { status: UserStatus.INACTIVE });
    }

    async resetPassword(userId: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const tempPassword = Math.random().toString(36).slice(-8);
        const rounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
        const passwordHash = await bcrypt.hash(tempPassword, rounds);

        await this.userRepository.update(userId, {
            passwordHash,
            mustChangePassword: true,
        });

        return tempPassword;
    }
}