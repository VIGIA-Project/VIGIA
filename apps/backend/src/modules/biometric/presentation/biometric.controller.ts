import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { BiometricService } from '../application/biometric.service';

@Controller('biometric/perfiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async listar() {
    return this.biometricService.listarConNombrePersona();
  }

  @Get('count')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async contarDisponibles() {
    const count = await this.biometricService.contarDisponibles();
    return { count };
  }

  @Post('persona/:personaId')
  @Roles(UserRole.ADMIN)
  async crearPerfil(@Param('personaId') personaId: string) {
    const perfil = await this.biometricService.crearPerfil(personaId);
    return perfil.toJSON();
  }

  @Get('persona/:personaId')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async buscarPorPersonaId(@Param('personaId') personaId: string) {
    const perfil = await this.biometricService.buscarPorPersonaId(personaId);
    return perfil ? perfil.toJSON() : null;
  }
}
