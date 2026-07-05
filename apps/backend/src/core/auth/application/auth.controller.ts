import {
    Controller,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { AuthService } from './auth.service';
import { UserRole } from '../domain/user.entity';
import { JwtAuthGuard } from '../presentation/jwt-auth.guard';
import { RolesGuard } from '../presentation/roles.guard';
import { Roles } from '../presentation/roles.decorator';
import { Public } from '../presentation/public.decorator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(8)
    newPassword: string;
}

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    temporaryPassword: string;

    @IsString()
    @IsOptional()
    personaId?: string;
}

@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
        console.log(req)
        await this.authService.changePassword(
            req.user.id,
            dto.currentPassword,
            dto.newPassword,
        );
        return { message: 'Contraseña actualizada correctamente' };
    }

    @Post('users')
    @Roles(UserRole.ADMIN)
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.authService.createUser(
            dto.email,
            dto.role,
            dto.temporaryPassword,
            dto.personaId,
        );
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        };
    }

    @Patch('users/:id/activate')
    @Roles(UserRole.ADMIN)
    async activateUser(@Param('id') id: string) {
        await this.authService.activateUser(id);
        return { message: 'Usuario activado' };
    }

    @Patch('users/:id/deactivate')
    @Roles(UserRole.ADMIN)
    async deactivateUser(@Param('id') id: string) {
        await this.authService.deactivateUser(id);
        return { message: 'Usuario desactivado' };
    }

    @Patch('users/:id/reset-password')
    @Roles(UserRole.ADMIN)
    async resetPassword(@Param('id') id: string) {
        const tempPassword = await this.authService.resetPassword(id);
        return { temporaryPassword: tempPassword };
    }
}