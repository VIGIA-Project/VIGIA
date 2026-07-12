import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BusinessRuleViolationException, EntityNotFoundException } from '@core/exceptions/domain-exception';
import {
  MIEMBRO_GRUPO_FAMILIAR_REPOSITORY,
  PERMISO_TEMPORAL_REPOSITORY,
  PASE_ACCESO_RAPIDO_REPOSITORY,
} from '@shared/constants/injection-tokens';
import { IMiembroGrupoFamiliarRepository } from '../domain/repositories/miembro-grupo-familiar.repository';
import { IPermisoTemporalRepository } from '../domain/repositories/permiso-temporal.repository';
import { IPaseAccesoRapidoRepository } from '../domain/repositories/pase-acceso-rapido.repository';
import { MiembroGrupoFamiliar } from '../domain/entities/miembro-grupo-familiar.entity';
import { PermisoTemporal } from '../domain/entities/permiso-temporal.entity';
import { PaseAccesoRapido } from '../domain/entities/pase-acceso-rapido.entity';
import { Vigencia } from '../domain/value-objects/vigencia.vo';
import {
  ConstruccionConjuntoAutorizadoService,
  ConjuntoAutorizado,
} from '../domain/services/construccion-conjunto-autorizado.service';
import { EvaluacionPaseService, ResultadoEvaluacionPase } from '../domain/services/evaluacion-pase.service';
import { CrearMiembroGrupoFamiliarDto } from './dto/crear-miembro-grupo-familiar.dto';
import { CrearPermisoTemporalDto } from './dto/crear-permiso-temporal.dto';
import { CrearPaseRapidoDto } from './dto/crear-pase-rapido.dto';
import { REGISTRY_PORT, IRegistryPort } from '../../registry/application/ports/registry.port';

export interface ResultadoValidacionConsumo {
  valido: boolean;
  motivo: string;
  paseId: string | null;
  vehiculoId: string | null;
  propietarioId: string | null;
  placa: string;
  estado: string | null;
}

/**
 * Servicio de aplicación — orquesta los casos de uso del BC Authorization.
 * NO contiene reglas de negocio: esas viven en las entidades y servicios de
 * dominio. Este servicio solo coordina repositorios + servicios de dominio.
 */
@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(MIEMBRO_GRUPO_FAMILIAR_REPOSITORY)
    private readonly miembroGrupoFamiliarRepository: IMiembroGrupoFamiliarRepository,
    @Inject(PERMISO_TEMPORAL_REPOSITORY)
    private readonly permisoTemporalRepository: IPermisoTemporalRepository,
    @Inject(PASE_ACCESO_RAPIDO_REPOSITORY)
    private readonly paseAccesoRapidoRepository: IPaseAccesoRapidoRepository,
    private readonly construccionConjuntoAutorizadoService: ConstruccionConjuntoAutorizadoService,
    private readonly evaluacionPaseService: EvaluacionPaseService,
    @Inject(REGISTRY_PORT)
    private readonly registryPort: IRegistryPort,
  ) {}

  // ─── Grupo familiar ─────────────────────────────────────────────────

  async crearMiembroGrupoFamiliar(
    dto: CrearMiembroGrupoFamiliarDto,
    propietarioId: string,
  ): Promise<MiembroGrupoFamiliar> {
    const totalActivos = await this.miembroGrupoFamiliarRepository.contarActivosPorPropietario(
      propietarioId,
    );
    if (totalActivos >= MiembroGrupoFamiliar.LIMITE_MAXIMO) {
      throw new BusinessRuleViolationException(
        'MiembroGrupoFamiliar.limiteMaximo',
        `El propietario ya alcanzó el límite de ${MiembroGrupoFamiliar.LIMITE_MAXIMO} miembros del grupo familiar`,
      );
    }

    const yaEsMiembro = await this.miembroGrupoFamiliarRepository.existeMiembroActivo(
      dto.personaId,
      propietarioId,
    );
    if (yaEsMiembro) {
      throw new BusinessRuleViolationException(
        'MiembroGrupoFamiliar.duplicado',
        'Esta persona ya es miembro activo del grupo familiar de este propietario',
      );
    }

    const miembro = MiembroGrupoFamiliar.crear({
      id: uuidv4(),
      personaId: dto.personaId,
      propietarioId,
      relacion: dto.relacion,
    });
    return this.miembroGrupoFamiliarRepository.guardar(miembro);
  }

  async listarTodosGrupoFamiliar(): Promise<MiembroGrupoFamiliar[]> {
    return this.miembroGrupoFamiliarRepository.buscarTodos();
  }

  async listarGrupoFamiliarPorPropietario(propietarioId: string): Promise<MiembroGrupoFamiliar[]> {
    return this.miembroGrupoFamiliarRepository.buscarPorPropietario(propietarioId);
  }

  async listarGrupoFamiliarActivoPorPropietario(
    propietarioId: string,
  ): Promise<MiembroGrupoFamiliar[]> {
    return this.miembroGrupoFamiliarRepository.buscarActivosPorPropietario(propietarioId);
  }

  async revocarMiembroGrupoFamiliar(id: string): Promise<MiembroGrupoFamiliar> {
    const miembro = await this.miembroGrupoFamiliarRepository.buscarPorId(id);
    if (!miembro) {
      throw new EntityNotFoundException('MiembroGrupoFamiliar', id);
    }
    miembro.revocar();
    return this.miembroGrupoFamiliarRepository.guardar(miembro);
  }

  async contarMiembrosActivos(): Promise<number> {
    return this.miembroGrupoFamiliarRepository.contarActivosTotal();
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

  async listarTemporalesPorPropietario(propietarioId: string): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarPorPropietario(propietarioId);
  }

  async revocarPermiso(id: string): Promise<PermisoTemporal> {
    const permiso = await this.permisoTemporalRepository.buscarPorId(id);
    if (!permiso) {
      throw new EntityNotFoundException('PermisoTemporal', id);
    }
    permiso.revocar();
    return this.permisoTemporalRepository.guardar(permiso);
  }

  async contarPermisosVigentes(): Promise<number> {
    return this.permisoTemporalRepository.contarVigentes();
  }

  async listarProximosAExpirar(diasVentana: number): Promise<PermisoTemporal[]> {
    return this.permisoTemporalRepository.buscarProximosAExpirar(diasVentana);
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

  async obtenerPaseValidoPorPlaca(placa: string, instante?: Date): Promise<{ paseId: string } | null> {
    const pasesActivos = await this.paseAccesoRapidoRepository.buscarActivosPorPlaca(placa);
    const ahora = instante || new Date();
    
    // Find the first active pass that is within its validity period
    const paseValido = pasesActivos.find(
      (p) => p.estado === 'ACTIVO' && p.vigencia.estaVigente(ahora)
    );

    if (paseValido) {
      return { paseId: paseValido.id };
    }
    return null;
  }

  /**
   * Valida el código de un pase de acceso rápido contra una placa.
   * Solo para consultas inter-BC (no consume el pase).
   */
  async validarPase(codigo: string, placa: string): Promise<ResultadoEvaluacionPase> {
    return this.evaluacionPaseService.evaluar(codigo, placa);
  }

  /**
   * Valida y consume un pase de acceso rápido.
   * Para uso directo desde el endpoint del guardia (contrato 6.4).
   */
  async validarYConsumirPase(codigo: string, placa: string): Promise<ResultadoValidacionConsumo> {
    const placaNorm = placa.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    const resultado = await this.evaluacionPaseService.evaluar(codigo.trim(), placaNorm);

    if (!resultado.valido || !resultado.paseId) {
      return {
        valido: false,
        motivo: 'CODIGO_INVALIDO_O_EXPIRADO',
        paseId: null,
        vehiculoId: null,
        propietarioId: null,
        placa: placaNorm,
        estado: null,
      };
    }

    const pase = await this.paseAccesoRapidoRepository.buscarPorId(resultado.paseId);
    if (!pase) {
      return {
        valido: false,
        motivo: 'CODIGO_INVALIDO_O_EXPIRADO',
        paseId: null,
        vehiculoId: null,
        propietarioId: null,
        placa: placaNorm,
        estado: null,
      };
    }

    pase.consumir('VALIDACION-DIRECTA-GUARDIA');
    const paseConsumed = await this.paseAccesoRapidoRepository.guardar(pase);

    return {
      valido: true,
      motivo: 'PASE_VALIDO',
      paseId: paseConsumed.id,
      vehiculoId: paseConsumed.vehiculoId,
      propietarioId: paseConsumed.propietarioId,
      placa: paseConsumed.placa,
      estado: paseConsumed.estado,
    };
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

  async contarPasesActivos(): Promise<number> {
    return this.paseAccesoRapidoRepository.contarActivos();
  }

  // ─── Conjunto autorizado ────────────────────────────────────────────────

  async obtenerConjuntoAutorizado(
    vehiculoId: string,
    propietarioId: string,
    instante?: Date,
  ): Promise<any> {
    const conjunto = await this.construccionConjuntoAutorizadoService.construir(
      vehiculoId,
      propietarioId,
      instante,
    );

    const autorizadosEnriquecidos = await Promise.all(
      conjunto.autorizados.map(async (auth) => {
        const persona = await this.registryPort.findPersonaById(auth.personaId);
        return {
          ...auth,
          nombreCompleto: persona?.nombreCompleto || 'Usuario Desconocido',
        };
      }),
    );

    return {
      ...conjunto,
      autorizados: autorizadosEnriquecidos,
    };
  }
}
