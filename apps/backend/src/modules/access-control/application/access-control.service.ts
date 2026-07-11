import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { IPaseGaritaRepository } from '../domain/repositories/pase-garita.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { PaseGarita, EstadoPaseGarita } from '../domain/entities/pase-garita.entity';
import { OrigenResolucion, DecisionOperativa } from '../domain/value-objects/evento-acceso.vo';
import { RegistrarEventoManualDto, CrearPaseGaritaDto } from './dtos/registrar-evento-manual.dto';
import { NotificationService } from '../../notification/application/notification.service';
import { SeveridadNotificacion } from '../../notification/domain/entities/notificacion.entity';

export const EVENTO_ACCESO_REPOSITORY = 'EVENTO_ACCESO_REPOSITORY';
export const PASE_GARITA_REPOSITORY = 'PASE_GARITA_REPOSITORY';

@Injectable()
export class AccessControlService {
  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
    @Inject(PASE_GARITA_REPOSITORY)
    private readonly paseGaritaRepository: IPaseGaritaRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async obtenerEventosRecientes(limite = 7): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async registrarEventoManual(dto: RegistrarEventoManualDto, guardiaId: string): Promise<EventoAcceso> {
    const evento = new EventoAcceso(
      uuidv4(),
      dto.tipoMovimiento,
      dto.decision,
      OrigenResolucion.MANUAL,
      new Date(),
      dto.decision === DecisionOperativa.SUCCESSFUL ? 'ACC_001' : 'ERR_999', // Códigos temporales genéricos
      dto.vehiculoId,
      dto.personaId,
      dto.placaCapturada,
      dto.detalles,
    );
    await this.eventoAccesoRepository.guardar(evento);

    // Enviar notificación al Admin
    await this.notificationService.crearNotificacion({
      titulo: 'Resolución Manual',
      subtitulo: `El guardia autorizó un acceso mediante resolución manual para la placa ${dto.placaCapturada}`,
      severidad: SeveridadNotificacion.MEDIA,
      destinatarioRol: 'ADMIN',
      referenciaId: evento.id,
    });

    return evento;
  }

  async crearPaseGarita(dto: CrearPaseGaritaDto, guardiaId: string): Promise<PaseGarita> {
    const pase = new PaseGarita(
      uuidv4(),
      dto.placaVehiculo.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      dto.tipoMovimiento,
      dto.tipoVisitante,
      dto.nombreVisitante,
      dto.documentoVisitante,
      dto.destino,
      dto.duracionHoras,
      dto.descripcion,
      EstadoPaseGarita.ACTIVO,
      guardiaId,
      new Date(),
      null,
    );
    const guardado = await this.paseGaritaRepository.guardar(pase);

    // Al crear un pase de garita, se registra implícitamente el acceso
    const evento = new EventoAcceso(
      uuidv4(),
      dto.tipoMovimiento,
      DecisionOperativa.SUCCESSFUL,
      OrigenResolucion.MANUAL,
      new Date(),
      'ACC_VIS_001',
      undefined,
      undefined,
      pase.placaVehiculo,
      `Pase de garita ${pase.id} - ${pase.tipoVisitante} - ${pase.nombreVisitante}`,
    );
    await this.eventoAccesoRepository.guardar(evento);

    // Notificación al Admin sobre el nuevo pase
    await this.notificationService.crearNotificacion({
      titulo: 'Pase de Garita',
      subtitulo: `Nuevo pase generado: ${pase.tipoVisitante} (${pase.nombreVisitante})`,
      severidad: SeveridadNotificacion.INFORMATIVA,
      destinatarioRol: 'ADMIN',
      referenciaId: pase.id,
    });

    return guardado;
  }

  async listarPasesGarita(): Promise<PaseGarita[]> {
    return this.paseGaritaRepository.buscarTodos(30);
  }

  async contarPasesGaritaActivos(): Promise<number> {
    return this.paseGaritaRepository.contarActivos();
  }

  async finalizarPaseGarita(id: string): Promise<PaseGarita> {
    const pase = await this.paseGaritaRepository.buscarPorId(id);
    if (!pase) throw new Error('Pase de garita no encontrado');
    pase.finalizar();
    return this.paseGaritaRepository.guardar(pase);
  }
}
