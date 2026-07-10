import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PersonaUseCases } from '../application/use-cases/persona.use-cases';
import { CrearPersonaDto, ActualizarPersonaDto } from '../application/dtos/persona.dto';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';

@Controller('registry/personas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PersonaController {
    constructor(private readonly personaUseCases: PersonaUseCases) {}

    @Post()
    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearPersonaDto) {
        return this.personaUseCases.crear(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listar() {
        return this.personaUseCases.listar();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
    async buscarPorId(@Param('id') id: string) {
        return this.personaUseCases.buscarPorId(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async actualizar(
        @Param('id') id: string,
        @Body() dto: ActualizarPersonaDto,
    ) {
        return this.personaUseCases.actualizar(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    async eliminar(@Param('id') id: string) {
        return this.personaUseCases.eliminar(id);
    }

    @Patch(':id/enrollment-completo')
    @Roles(UserRole.ADMIN)
    async marcarEnrollmentCompleto(@Param('id') id: string) {
        return this.personaUseCases.marcarEnrollmentCompleto(id);
    }
}
