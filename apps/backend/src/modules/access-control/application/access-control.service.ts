import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVENTO_ACCESO_REPOSITORY, AUTHORIZATION_CONTRACT, ALERTING_CONTRACT } from '@shared/constants/injection-tokens';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { OrigenResolucion } from '../domain/value-objects/origen-resolucion.vo';
import { RegistrarEventoManualDto } from './dtos/registrar-evento-manual.dto';
import { InvitadoActivoDto } from './dtos/invitado-activo.dto';
import { IAuthorizationContract } from '@shared/interfaces/contracts/authorization.contract';
import { IAlertingContract } from '@shared/interfaces/contracts/alerting.contract';
import { AlertSeverity } from '@shared/enums';

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
    @Inject(AUTHORIZATION_CONTRACT)
    private readonly authorizationContract: IAuthorizationContract,
    @Inject(ALERTING_CONTRACT)
    private readonly alertingContract: IAlertingContract,
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
      duracionAutorizadaMin: dto.duracionAutorizadaMin,
    });
    const guardado = await this.eventoAccesoRepository.guardar(evento);

    // Consumir pase si fue validado
    if (guardado.decisionOperativa === 'SUCCESSFUL' && guardado.motivoCodigo === 'PASE_VALIDADO') {
      const paseValido = await this.authorizationContract.obtenerPaseValidoPorPlaca(guardado.placaObservada);
      if (paseValido) {
        await this.authorizationContract.consumirPase(paseValido.paseId, guardado.id);
      }
    }

    // Emitir alerta idempotente si fue denegado
    if (guardado.decisionOperativa === 'DENIED') {
      try {
        await this.alertingContract.emitAlert({
          title: 'ACCESO_DENEGADO',
          message: `Acceso denegado para placa ${guardado.placaObservada}: ${guardado.motivoCodigo}`,
          severity: AlertSeverity.HIGH,
          sourceContext: 'ACCESS_CONTROL',
          sourceEntityId: guardado.id,
        });
      } catch {
        // No bloquear el registro del evento si alerting falla
      }
    }

    return guardado;
  }

  async listarRecientes(limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async listarEventosPorVehiculo(vehiculoId: string, limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarPorVehiculo(vehiculoId, limite);
  }

  async contarHoy(): Promise<number> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return this.eventoAccesoRepository.contarPorRangoFecha(inicioDia, finDia);
  }

  async listarInvitadosActivos(): Promise<InvitadoActivoDto[]> {
    const eventos = await this.eventoAccesoRepository.buscarInvitadosActivos();
    return eventos.map((evento) => this.aInvitadoActivoDto(evento));
  }

  async contarInvitadosActivos(): Promise<number> {
    const invitados = await this.listarInvitadosActivos();
    return invitados.length;
  }

  private aInvitadoActivoDto(evento: EventoAcceso): InvitadoActivoDto {
    const duracion = evento.duracionAutorizadaMin ?? null;
    const estaExcedido =
      duracion != null && Date.now() - evento.capturadoEn.getTime() > duracion * 60000;
    return {
      eventoId: evento.id,
      placaObservada: evento.placaObservada,
      motivoDetalle: evento.motivoDetalle ?? '',
      capturadoEn: evento.capturadoEn,
      duracionAutorizadaMin: duracion,
      estaExcedido,
    };
  }
}
