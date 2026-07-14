import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Autentica dispositivos edge (garitas) mediante una API Key fija,
 * ya que no manejan un JWT de usuario. La clave se compara contra
 * EDGE_DEVICE_API_KEY del .env.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const expectedKey = this.configService.get<string>('EDGE_DEVICE_API_KEY');

    if (!expectedKey || !apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('API Key de dispositivo inválida o ausente');
    }

    return true;
  }
}
