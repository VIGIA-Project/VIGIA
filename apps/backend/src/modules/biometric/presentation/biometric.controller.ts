import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { BiometricService } from '../application/biometric.service';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';

@Controller('biometric')
@UseGuards(JwtAuthGuard)
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Get('perfiles/count')
  async contarPerfiles() {
    const total = await this.biometricService.contarPerfilesActivos();
    return { count: total };
  }

  @Get('perfiles')
  async obtenerTodos() {
    const perfiles = await this.biometricService.obtenerTodos();
    return perfiles.map(p => ({
      id: p.id,
      personaId: p.personaId,
      tipoPerfil: p.tipoPerfil,
      estado: p.estado,
    }));
  }

  @Post('perfiles/me')
  async registrarPerfilPropio(@Request() req: any) {
    // The user's personaId should be populated in req.user from JWT
    const personaId = req.user?.personaId;
    if (!personaId) {
      throw new Error('Persona ID no encontrado en la sesión del usuario');
    }
    await this.biometricService.registrarPerfil(personaId);
    return { success: true, message: 'Perfil biométrico registrado exitosamente' };
  }
}
