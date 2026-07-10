import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EntityNotFoundException } from '@core/exceptions/domain-exception';
import {
  AUTORIZACION_PERMANENTE_REPOSITORY,
  PERMISO_TEMPORAL_REPOSITORY,
  PASE_ACCESO_RAPIDO_REPOSITORY,
} from '@shared/constants/injection-tokens';
import { IAutorizacionPermanenteRepository } from '../domain/repositories/autorizacion-permanente.repository';
import { IPermisoTemporalRepository } from '../domain/repositories/permiso-temporal.repository';
import { IPaseAccesoRapidoRepository } from '../domain/repositories/pase-acceso-rapido.repository';
import { AutorizacionPermanente } from '../domain/entities/autorizacion-permanente.entity';
import { PermisoTemporal } from '../domain/entities/permiso-temporal.entity';
import { PaseAccesoRapido } from '../domain/entities/pase-acceso-rapido.entity';
import { Vigencia } from '../domain/value-objects/vigencia.vo';
import {
  ConstruccionConjuntoAutorizadoService,
  ConjuntoAutorizado,
} from '../domain/services/construccion-conjunto-autorizado.service';
import { EvaluacionPaseService, ResultadoEvaluacionPase } from '../domain/services/evaluacion-pase.service';
import { CrearAutorizacionPermanenteDto } from './dto/crear-autorizacion-permanente.dto';
import { CrearPermisoTemporalDto } from './dto/crear-permiso-temporal.dto';
import { CrearPaseRapidoDto } from './dto/crear-pase-rapido.dto';

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Authorization.
 * NO contiene reglas de negocio: esas viven en las entidades y servicios de
 * dominio. Este servicio solo coordina repositorios + servicios de dominio.
 */
@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(AUTORIZACION_PERMANENTE_REPOSITORY)
    private readonly autorizacionPermanenteRepository: IAutorizacionPermanenteRepository,
    @Inject(PERMISO_TEMPORAL_REPOSITORY)
    private readonly permisoTemporalRepository: IPermisoTemporalRepository,
    @Inject(PASE_ACCESO_RAPIDO_REPOSITORY)
    private readonly paseAccesoRapidoRepository: IPaseAccesoRapidoRepository,
    private readonly construccionConjuntoAutorizadoService: ConstruccionConjuntoAutorizadoService,
    private readonly evaluacionPaseService: EvaluacionPaseService,
  ) {}

  // ─── Autorizaciones permanentes ──────────────────────────────────────

  async crearAutorizacionPermanente(
    dto: CrearAutorizacionPermanenteDto,
    propietarioId: string,
  ): Promise<AutorizacionPermanente> {
    const autorizacion = AutorizacionPermanente.crear({
      id: uuidv4(),
      personaId: dto.personaId,
      vehiculoId: dto.vehiculoId,
      propietarioId,
      relacion: dto.relacion,
    });
    return this.autorizacionPermanenteRepository.guardar(autorizacion);
  }

  async listarPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]> {
    return this.autorizacionPermanenteRepository.buscarPorVehiculo(vehiculoId);
  }

  async listarActivasPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]> {
    return this.autorizacionPermanenteRepository.buscarActivasPorVehiculo(vehiculoId);
  }

  async listarTodasPermanentes(): Promise<AutorizacionPermanente[]> {
    return this.autorizacionPermanenteRepository.buscarTodas();
  }

  async revocarAutorizacion(id: string): Promise<AutorizacionPermanente> {
    const autorizacion = await this.autorizacionPermanenteRepository.buscarPorId(id);
    if (!autorizacion) {
      throw new EntityNotFoundException('AutorizacionPermanente', id);
    }
    autorizacion.revocar();
    return this.autorizacionPermanenteRepository.guardar(autorizacion);
  }

  // ─── Permisos temporales ──────────────────────────────────────────────

  async crearPermisoTemporal(
    dto: CrearPermisoTemporalDto,
    propietarioId: string,
  ): Promise<PermisoTemporal> {
    const vigencia = Vigencia.crear(new Date(dto.vigenciaInicio), new Date(dto.vigenciaFin));
    const permiso = PermisoTemporal.crear({
      id: uuidv4(),
      personaId: dto.personaId,
      vehiculoId: dto.vehiculoId,
      propietarioId,
      vigencia,
      motivo: dto.motivo,
    });
    return this.permisoTemporalRepository.guardar(permiso);
  }

  async listarVigentesPorVehiculo(vehiculoId: string): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarVigentesPorVehiculo(vehiculoId);
  }

  async listarPorPersona(personaId: string): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarPorPersona(personaId);
  }

  async listarTodosTemporales(): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarTodos();
  }

  async contarPermanentesActivas(): Promise<number> {
    return this.autorizacionPermanenteRepository.contarActivas();
  }

  async contarTemporalesActivos(): Promise<number> {
    return this.permisoTemporalRepository.contarActivos();
  }

  async obtenerPermisosProximosAExpirar(diasVentana = 2): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarProximosAExpirar(diasVentana);
  }

  async revocarPermiso(id: string): Promise<PermisoTemporal> {
    const permiso = await this.permisoTemporalRepository.buscarPorId(id);
    if (!permiso) {
      throw new EntityNotFoundException('PermisoTemporal', id);
    }
    permiso.revocar();
    return this.permisoTemporalRepository.guardar(permiso);
  }

  // ─── Pases de acceso rápido ────────────────────────────────────────────

  async generarPase(
    dto: CrearPaseRapidoDto,
    propietarioId: string,
  ): Promise<{ pase: PaseAccesoRapido; codigoPlano: string }> {
    const { codigoPlano, codigoHash } = await PaseAccesoRapido.generarCodigo();
    const vigencia = Vigencia.crear(new Date(dto.vigenciaInicio), new Date(dto.vigenciaFin));

    const pase = PaseAccesoRapido.crear({
      id: uuidv4(),
      vehiculoId: dto.vehiculoId,
      propietarioId,
      placa: dto.placa,
      codigoHash,
      vigencia,
      nombreVisitante: dto.nombreVisitante,
      cedulaVisitante: dto.cedulaVisitante,
      motivo: dto.motivo,
    });

    const guardado = await this.paseAccesoRapidoRepository.guardar(pase);
    return { pase: guardado, codigoPlano };
  }

  async listarPorPropietario(propietarioId: string): Promise<PaseAccesoRapido[]> {
    return this.paseAccesoRapidoRepository.buscarPorPropietario(propietarioId);
  }

  async listarActivosPorPlaca(placa: string): Promise<PaseAccesoRapido[]> {
    return this.paseAccesoRapidoRepository.buscarActivosPorPlaca(placa);
  }

  async validarPase(codigo: string, placa: string): Promise<ResultadoEvaluacionPase> {
    return this.evaluacionPaseService.evaluar(codigo, placa);
  }

  async revocarPase(id: string): Promise<PaseAccesoRapido> {
    const pase = await this.paseAccesoRapidoRepository.buscarPorId(id);
    if (!pase) {
      throw new EntityNotFoundException('PaseAccesoRapido', id);
    }
    pase.revocar();
    return this.paseAccesoRapidoRepository.guardar(pase);
  }

  async consumirPase(id: string, eventoId: string): Promise<PaseAccesoRapido> {
    const pase = await this.paseAccesoRapidoRepository.buscarPorId(id);
    if (!pase) {
      throw new EntityNotFoundException('PaseAccesoRapido', id);
    }
    pase.consumir(eventoId);
    return this.paseAccesoRapidoRepository.guardar(pase);
  }

  // ─── Conjunto autorizado ────────────────────────────────────────────────

  async obtenerConjuntoAutorizado(
    vehiculoId: string,
    propietarioId: string,
    instante?: Date,
  ): Promise<ConjuntoAutorizado> {
    return this.construccionConjuntoAutorizadoService.construir(
      vehiculoId,
      propietarioId,
      instante,
    );
  }
}
