import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AccessControlService } from '../application/access-control.service';

@Controller('integrations')
// @UseGuards(JwtAuthGuard, RolesGuard) // In a real scenario, this might use an API Key guard instead
export class IntegrationsController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('ocr/webhook')
  @HttpCode(HttpStatus.CREATED)
  async webhookOcr(@Body() payload: { placa: string; nivelConfianza: number; timestamp: string }) {
    // Fase 5: Contrato de Integración OCR.
    // Actualmente solo registra que se recibió, no dispara lógica compleja para no depender del modelo IA.
    console.log(`[Integrations] OCR Webhook recibido: Placa ${payload.placa} con confianza ${payload.nivelConfianza}`);
    
    // Aquí en el futuro se llamará a this.accessControlService.resolverAccesoAutomatico(...)
    return { success: true, message: 'OCR payload recibido correctamente' };
  }

  @Post('biometria/webhook')
  @HttpCode(HttpStatus.CREATED)
  async webhookBiometria(@Body() payload: { personaId: string; features: number[]; timestamp: string }) {
    // Fase 5: Contrato de Integración Biometría.
    console.log(`[Integrations] Biometria Webhook recibido para personaId ${payload.personaId}`);
    
    return { success: true, message: 'Biometria payload recibido correctamente' };
  }
}
