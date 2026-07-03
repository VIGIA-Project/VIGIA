import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Guard JWT base - esqueleto para implementación futura.
 * Actualmente permite todo el tráfico (modo desarrollo).
 * Implementar lógica JWT en el BC de Authorization.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // TODO: Implementar validación JWT real en BC de Authorization
    // const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    // if (!token) throw new UnauthorizedException();
    // ...

    return true; // Permitir en desarrollo
  }
}
