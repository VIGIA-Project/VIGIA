import { Controller, Get } from '@nestjs/common';
import { BiometricService } from '../application/biometric.service';

@Controller('biometric')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Get('perfiles/count')
  async contarPerfiles() {
    const total = await this.biometricService.contarPerfilesActivos();
    return { count: total };
  }
}
