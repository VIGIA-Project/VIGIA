import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsEnum,
    IsInt,
    IsBoolean,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuthService } from './auth.service';
import { UserRole, UserStatus } from '../domain/user.entity';
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

export class UpdateOnboardingStatusDto {
    @IsOptional()
    @IsBoolean()
    biometric_registered?: boolean;

    @IsOptional()
    @IsBoolean()
    vehicle_registered?: boolean;
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

export class ListUsersQueryDto {
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
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
        await this.authService.changePassword(
            req.user.id,
            dto.currentPassword,
            dto.newPassword,
        );
        return { message: 'Contraseña actualizada correctamente' };
    }

    @Patch('users/me/onboarding-status')
    @HttpCode(HttpStatus.OK)
    async updateOwnOnboardingStatus(@Request() req, @Body() dto: UpdateOnboardingStatusDto) {
        return this.authService.updateOnboardingStatus(req.user.id, dto);
    }

    @Post('users')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Request() req, @Body() dto: CreateUserDto) {
        return this.authService.createUser(
            dto.email,
            dto.role,
            dto.temporaryPassword,
            dto.personaId,
            req.user.id,
        );
    }

    @Get('users')
    @Roles(UserRole.ADMIN)
    async listUsers(@Query() query: ListUsersQueryDto) {
        return this.authService.findAll({
            role: query.role,
            status: query.status,
            page: query.page,
            limit: query.limit,
        });
    }

    @Get('users/:id')
    @Roles(UserRole.ADMIN)
    async getUser(@Param('id') id: string) {
        return this.authService.findById(id);
    }

    @Patch('users/:id/activate')
    @Roles(UserRole.ADMIN)
    async activateUser(@Request() req, @Param('id') id: string) {
        await this.authService.activateUser(id, req.user.id);
        return { message: 'Usuario activado' };
    }

    @Patch('users/:id/deactivate')
    @Roles(UserRole.ADMIN)
    async deactivateUser(@Request() req, @Param('id') id: string) {
        await this.authService.deactivateUser(id, req.user.id);
        return { message: 'Usuario desactivado' };
    }

    @Patch('users/:id/reset-password')
    @Roles(UserRole.ADMIN)
    async resetPassword(@Request() req, @Param('id') id: string) {
        const tempPassword = await this.authService.resetPassword(id, req.user.id);
        return { temporaryPassword: tempPassword };
    }
}