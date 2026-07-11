import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVENTO_ACCESO_REPOSITORY } from '@shared/constants/injection-tokens';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { OrigenResolucion } from '../domain/value-objects/origen-resolucion.vo';
import { RegistrarEventoManualDto } from './dtos/registrar-evento-manual.dto';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Access Control.
 * La resolución automática (OCR + biometría) todavía no está conectada;
 * por ahora solo se soporta el registro manual que hace el guardia en garita.
 */
@Injectable()
export class AccessControlService {
  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
  ) {}

  async registrarEventoManual(dto: RegistrarEventoManualDto): Promise<EventoAcceso> {
    const ahora = new Date();
    const evento = EventoAcceso.crear({
      id: uuidv4(),
      vehiculoId: dto.vehiculoId,
      personaDetectadaId: dto.personaId,
      placaObservada: dto.placaObservada,
      tipoMovimiento: dto.tipoMovimiento,
      decisionOperativa: dto.decisionOperativa,
      motivoCodigo: dto.motivoCodigo,
      motivoDetalle: dto.motivoDetalle,
      origenResolucion: OrigenResolucion.MANUAL,
      capturadoEn: ahora,
      resueltoEn: ahora,
    });
    return this.eventoAccesoRepository.guardar(evento);
  }

  async listarRecientes(limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async contarHoy(): Promise<number> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return this.eventoAccesoRepository.contarPorRangoFecha(inicioDia, finDia);
  }
}
