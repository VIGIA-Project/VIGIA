import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Request,
    UseGuards,
    HttpCode,
    HttpStatus,
    ForbiddenException,
} from '@nestjs/common';
import { VehiculoUseCases } from '../application/use-cases/vehiculo.use-cases';
import { CrearVehiculoDto, ActualizarVehiculoDto } from '../application/dtos/vehiculo.dto';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';

@Controller('registry/vehiculos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiculoController {
    constructor(private readonly vehiculoUseCases: VehiculoUseCases) {}

    @Post()
    @Roles(UserRole.ADMIN, UserRole.OWNER)
    @HttpCode(HttpStatus.CREATED)
    async crear(@Request() req: any, @Body() dto: CrearVehiculoDto) {
        if (req.user?.role === UserRole.OWNER && dto.propietarioPersonaId !== req.user?.personaId) {
            throw new ForbiddenException('No puede registrar un vehículo para otro propietario');
        }
        return this.vehiculoUseCases.crear(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listar() {
        return this.vehiculoUseCases.listar();
    }

    @Get('count')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async contar() {
        return this.vehiculoUseCases.contar();
    }

    @Get('placa/:placa')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async buscarPorPlaca(@Param('placa') placa: string) {
        return this.vehiculoUseCases.buscarPorPlaca(placa);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
    async buscarPorId(@Param('id') id: string) {
        return this.vehiculoUseCases.buscarPorId(id);
    }

    @Get('propietario/:propietarioId')
    @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.OWNER)
    async listarPorPropietario(@Param('propietarioId') propietarioId: string) {
        return this.vehiculoUseCases.listarPorPropietario(propietarioId);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.OWNER)
    async actualizar(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: ActualizarVehiculoDto,
    ) {
        if (req.user?.role === UserRole.OWNER) {
            const vehiculo = await this.vehiculoUseCases.buscarPorId(id);
            if (vehiculo.propietarioPersonaId !== req.user?.personaId) {
                throw new ForbiddenException('No puede modificar un vehículo ajeno');
            }
        }
        return this.vehiculoUseCases.actualizar(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    async eliminar(@Param('id') id: string) {
        return this.vehiculoUseCases.eliminar(id);
    }
}