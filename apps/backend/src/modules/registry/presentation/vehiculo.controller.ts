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
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearVehiculoDto) {
        return this.vehiculoUseCases.crear(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listar() {
        return this.vehiculoUseCases.listar();
    }

    @Get('placa/:placa')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async buscarPorPlaca(@Param('placa') placa: string) {
        return this.vehiculoUseCases.buscarPorPlaca(placa);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async buscarPorId(@Param('id') id: string) {
        return this.vehiculoUseCases.buscarPorId(id);
    }

    @Get('propietario/:propietarioId')
    @Roles(UserRole.ADMIN, UserRole.GUARD)
    async listarPorPropietario(@Param('propietarioId') propietarioId: string) {
        return this.vehiculoUseCases.listarPorPropietario(propietarioId);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async actualizar(
        @Param('id') id: string,
        @Body() dto: ActualizarVehiculoDto,
    ) {
        return this.vehiculoUseCases.actualizar(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    async eliminar(@Param('id') id: string) {
        return this.vehiculoUseCases.eliminar(id);
    }
}