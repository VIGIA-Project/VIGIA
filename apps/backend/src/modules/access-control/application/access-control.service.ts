import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVENTO_ACCESO_REPOSITORY } from '@shared/constants/injection-tokens';
import { IEventoAccesoRepository } from '../domain/repositories/evento-acceso.repository';
import { EventoAcceso } from '../domain/entities/evento-acceso.entity';
import { OrigenResolucion } from '../domain/value-objects/origen-resolucion.vo';
import { DecisionOperativa } from '../domain/value-objects/decision-operativa.vo';
import { RegistrarEventoManualDto } from './dtos/registrar-evento-manual.dto';
import { InvitadoActivoDto } from './dtos/invitado-activo.dto';
import { AlertingService } from '../../alerting/application/alerting.service';
import { REGISTRY_PORT, IRegistryPort } from '../../registry/application/ports/registry.port';
import { BiometricService } from '../../biometric/application/biometric.service';
import { TipoMovimiento } from '../domain/value-objects/tipo-movimiento.vo';
/**
 * Servicio de aplicación — orquesta los casos de uso del BC Access Control.
 * La resolución automática (OCR + biometría) todavía no está conectada;
 * por ahora solo se soporta el registro manual que hace el guardia en garita.
 */
@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(
    @Inject(EVENTO_ACCESO_REPOSITORY)
    private readonly eventoAccesoRepository: IEventoAccesoRepository,
    private readonly alertingService: AlertingService,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
    private readonly biometricService: BiometricService,
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

    if (guardado.decisionOperativa === DecisionOperativa.DENIED) {
      this.alertingService
        .crearAlertaDesdeEventoDenegado({
          eventoId: guardado.id,
          vehiculoId: guardado.vehiculoId,
          placa: guardado.placaObservada,
          motivoCodigo: guardado.motivoCodigo,
          tipoMovimiento: guardado.tipoMovimiento,
        })
        .catch((err) => this.logger.warn(`No se pudo generar alerta de acceso denegado: ${err?.message}`));
    }

    return guardado;
  }

  async procesarAccesoEdge(
    fotoRostro: Buffer,
    tipoMovimiento: TipoMovimiento,
    fotoPlaca?: Buffer,
    placaManual?: string
  ): Promise<EventoAcceso> {
    // 1. Obtener placa (mockeando OCR si no llega placa manual o foto)
    let placa = placaManual || 'PCH0001';
    
    if (fotoPlaca) {
      try {
        const ocrUrl = process.env.OCR_SERVICE_URL || 'http://127.0.0.1:8001';
        const formData = new FormData();
        formData.append('imagen', new Blob([fotoPlaca as any]), 'placa.jpg');

        const ocrRes = await fetch(`${ocrUrl}/ocr/leer-placa`, {
          method: 'POST',
          body: formData as any,
        });

        if (ocrRes.ok) {
          const ocrData = await ocrRes.json();
          if (ocrData.placa && ocrData.es_formato_valido !== false) {
            placa = ocrData.placa;
          }
        } else {
          this.logger.warn(`OCR API falló con status: ${ocrRes.status}`);
        }
      } catch (err: any) {
        this.logger.error(`Error de red al invocar OCR: ${err.message}`);
      }
    }
    
    // 2. Validar vehiculo
    const vehiculo = await this.registryPort.findVehiculoByPlaca(placa);
    if (!vehiculo) {
      return this.guardarEventoEdge({
        vehiculoId: null,
        personaId: null,
        placaObservada: placa,
        tipoMovimiento,
        decisionOperativa: DecisionOperativa.DENIED,
        motivoCodigo: 'VEHICULO_NO_REGISTRADO',
        motivoDetalle: 'La placa no existe en el registro',
      });
    }

    // 3. Obtener personas autorizadas
    const propietario = await this.registryPort.findPropietarioByVehiculo(vehiculo.vehiculoId);
    const grupoFamiliar = await this.registryPort.findGrupoFamiliarByVehiculo(vehiculo.vehiculoId);
    const autorizados = await this.registryPort.findPersonasAutorizadasByVehiculo(vehiculo.vehiculoId);

    const candidatosIds = new Set<string>();
    if (vehiculo.propietarioPersonaId) candidatosIds.add(vehiculo.propietarioPersonaId);
    if (propietario) candidatosIds.add(propietario.personaId);
    grupoFamiliar.forEach(f => candidatosIds.add(f.personaId));
    autorizados.forEach(a => candidatosIds.add(a.personaId));

    if (candidatosIds.size === 0) {
       return this.guardarEventoEdge({
        vehiculoId: vehiculo.vehiculoId,
        personaId: null,
        placaObservada: placa,
        tipoMovimiento,
        decisionOperativa: DecisionOperativa.DENIED,
        motivoCodigo: 'SIN_AUTORIZADOS',
        motivoDetalle: 'El vehiculo no tiene conductores autorizados enrolados',
      });
    }

    // 4. Verificar biometria
    const resultadoBio = await this.biometricService.verificarIdentidad(fotoRostro, Array.from(candidatosIds));

    if (!resultadoBio.match) {
      return this.guardarEventoEdge({
        vehiculoId: vehiculo.vehiculoId,
        personaId: null,
        placaObservada: placa,
        tipoMovimiento,
        decisionOperativa: DecisionOperativa.DENIED,
        motivoCodigo: 'CONDUCTOR_NO_AUTORIZADO',
        motivoDetalle: resultadoBio.message || 'Rostro no registrado por el propietario',
      });
    }

    // Match exitoso
    let roleName = 'Conductor Autorizado';
    let personName = 'Desconocido';

    if (resultadoBio.personaId) {
      const persona = await this.registryPort.findPersonaById(resultadoBio.personaId);
      if (persona) {
        personName = persona.nombreCompleto;
        if (vehiculo.propietarioPersonaId === persona.personaId) {
          roleName = 'Propietario';
        } else if (grupoFamiliar.some(f => f.personaId === persona.personaId)) {
          roleName = 'Familiar Autorizado';
        } else {
          // Verify against autorizados enum if we had a specific sub-role
          const asignacion = autorizados.find(a => a.personaId === persona.personaId);
          if (asignacion && asignacion.rol) {
             const rolesMap: Record<string, string> = {
               'FAMILIAR_AUTORIZADO': 'Familiar Autorizado',
               'CONDUCTOR_PERMANENTE': 'Conductor Permanente',
               'PERSONA_AUTORIZADA': 'Persona Autorizada'
             };
             roleName = rolesMap[asignacion.rol] || 'Conductor Autorizado';
          }
        }
      }
    }

    return this.guardarEventoEdge({
      vehiculoId: vehiculo.vehiculoId,
      personaId: resultadoBio.personaId,
      placaObservada: placa,
      tipoMovimiento,
      decisionOperativa: DecisionOperativa.SUCCESSFUL,
      motivoCodigo: 'ACCESO_AUTORIZADO',
      motivoDetalle: `Identidad confirmada automáticamente ${roleName} (${personName})`,
    });
  }

  private async guardarEventoEdge(data: any): Promise<EventoAcceso> {
    const ahora = new Date();
    const evento = EventoAcceso.crear({
      id: uuidv4(),
      vehiculoId: data.vehiculoId,
      personaDetectadaId: data.personaId,
      placaObservada: data.placaObservada,
      tipoMovimiento: data.tipoMovimiento,
      decisionOperativa: data.decisionOperativa,
      motivoCodigo: data.motivoCodigo,
      motivoDetalle: data.motivoDetalle,
      origenResolucion: OrigenResolucion.AUTOMATICA,
      capturadoEn: ahora,
      resueltoEn: ahora,
    });

    const guardado = await this.eventoAccesoRepository.guardar(evento);

    if (guardado.decisionOperativa === DecisionOperativa.DENIED) {
      this.alertingService
        .crearAlertaDesdeEventoDenegado({
          eventoId: guardado.id,
          vehiculoId: guardado.vehiculoId,
          placa: guardado.placaObservada,
          motivoCodigo: guardado.motivoCodigo,
          tipoMovimiento: data.tipoMovimiento,
        })
        .catch((err) => this.logger.warn(`No se pudo generar alerta de acceso denegado: ${err?.message}`));
    }

    return guardado;
  }

  async listarRecientes(limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarRecientes(limite);
  }

  async listarPorVehiculo(vehiculoId: string, limite: number): Promise<EventoAcceso[]> {
    return this.eventoAccesoRepository.buscarPorVehiculo(vehiculoId, limite);
  }

  async buscarPorId(id: string): Promise<EventoAcceso> {
    const evento = await this.eventoAccesoRepository.buscarPorId(id);
    if (!evento) {
      throw new NotFoundException(`Evento de acceso '${id}' no encontrado`);
    }
    return evento;
  }

  async contarHoy(): Promise<number> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    return this.eventoAccesoRepository.contarPorRangoFecha(inicioDia, finDia);
  }

  async contarHoyPorTipo(): Promise<{ entradas: number; salidas: number }> {
    const ahora = new Date();
    const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    const [entradas, salidas] = await Promise.all([
      this.eventoAccesoRepository.contarPorRangoFechaYTipo(inicioDia, finDia, 'ENTRADA'),
      this.eventoAccesoRepository.contarPorRangoFechaYTipo(inicioDia, finDia, 'SALIDA'),
    ]);
    return { entradas, salidas };
  }

  async listarInvitadosActivos(): Promise<InvitadoActivoDto[]> {
    const eventos = await this.eventoAccesoRepository.buscarInvitadosActivos();
    const invitados = eventos.map((evento) => this.aInvitadoActivoDto(evento));

    invitados
      .filter((i) => i.estaExcedido)
      .forEach((invitado) => {
        this.alertingService
          .crearAlertaInvitadoExcedido({
            eventoId: invitado.eventoId,
            vehiculoId: eventos.find((e) => e.id === invitado.eventoId)?.vehiculoId,
            placa: invitado.placaObservada,
            duracionAutorizadaMin: invitado.duracionAutorizadaMin ?? 0,
          })
          .catch((err) => this.logger.warn(`No se pudo generar alerta de invitado excedido: ${err?.message}`));
      });

    return invitados;
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
