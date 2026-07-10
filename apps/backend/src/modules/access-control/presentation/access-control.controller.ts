import { Controller, Get, Query } from '@nestjs/common';
import { AccessControlService } from '../application/access-control.service';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get('eventos/recientes')
  async obtenerEventosRecientes(@Query('limite') limite?: string) {
    const lim = limite ? parseInt(limite, 10) : 7;
    return this.accessControlService.obtenerEventosRecientes(lim);
  }
}
