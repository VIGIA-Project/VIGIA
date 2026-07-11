import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { INotificacionRepository } from '../domain/repositories/notificacion.repository';
import { Notificacion, SeveridadNotificacion } from '../domain/entities/notificacion.entity';
import { CrearNotificacionDto } from './dtos/crear-notificacion.dto';
import { EntityNotFoundException } from '@core/exceptions/domain-exception';

export const NOTIFICACION_REPOSITORY = 'NOTIFICACION_REPOSITORY';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICACION_REPOSITORY)
    private readonly notificacionRepository: INotificacionRepository,
  ) {}

  async crearNotificacion(dto: CrearNotificacionDto): Promise<Notificacion> {
    const notificacion = new Notificacion(
      uuidv4(),
      dto.titulo,
      dto.subtitulo,
      dto.severidad || SeveridadNotificacion.INFORMATIVA,
      dto.destinatarioRol || null,
      dto.destinatarioPersonaId || null,
      false,
      dto.referenciaId || null,
      new Date(),
    );
    return this.notificacionRepository.guardar(notificacion);
  }

  async obtenerPorRolYPersona(rol: string, personaId?: string, limite = 20): Promise<Notificacion[]> {
    if (personaId) {
      return this.notificacionRepository.buscarPorRolYPersona(rol, personaId, limite);
    }
    return this.notificacionRepository.buscarPorRol(rol, limite);
  }

  async contarNoLeidas(rol: string, personaId?: string): Promise<number> {
    return this.notificacionRepository.contarNoLeidas(rol, personaId);
  }

  async marcarComoLeida(id: string): Promise<Notificacion> {
    const notif = await this.notificacionRepository.buscarPorId(id);
    if (!notif) {
      throw new EntityNotFoundException('Notificacion', id);
    }
    notif.marcarLeida();
    return this.notificacionRepository.guardar(notif);
  }
}
