import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AsignacionRolUseCases } from '../application/use-cases/asignacion-rol.use-cases';
import { CrearAsignacionRolDto } from '../application/dtos/asignacion-rol.dto';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';

@Controller('registry/asignaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsignacionRolController {
    constructor(private readonly asignacionUseCases: AsignacionRolUseCases) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearAsignacionRolDto) {
        return this.asignacionUseCases.crear(dto);
    }

    @Get('vehiculo/:vehiculoId')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listarPorVehiculo(@Param('vehiculoId') vehiculoId: string) {
        return this.asignacionUseCases.listarPorVehiculo(vehiculoId);
    }

    @Get('persona/:personaId')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listarPorPersona(@Param('personaId') personaId: string) {
        return this.asignacionUseCases.listarPorPersona(personaId);
    }

    @Get('vehiculo/:vehiculoId/grupo-familiar')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async consultarGrupoFamiliar(@Param('vehiculoId') vehiculoId: string) {
        return this.asignacionUseCases.consultarGrupoFamiliar(vehiculoId);
    }

    @Patch(':id/desactivar')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async desactivar(@Param('id') id: string) {
        await this.asignacionUseCases.desactivar(id);
        return { message: 'Asignación desactivada' };
    }
}