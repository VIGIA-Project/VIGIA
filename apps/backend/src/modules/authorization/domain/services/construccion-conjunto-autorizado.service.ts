import { IAutorizacionPermanenteRepository } from '../repositories/autorizacion-permanente.repository';
import { IPermisoTemporalRepository } from '../repositories/permiso-temporal.repository';
import { TipoAutorizacion } from '../value-objects/tipo-autorizacion.vo';

export interface MiembroConjuntoAutorizado {
  personaId: string;
  tipo: TipoAutorizacion;
  vigenciaFin?: Date;
}

export interface ConjuntoAutorizado {
  vehiculoId: string;
  propietarioId: string;
  autorizados: MiembroConjuntoAutorizado[];
}

/**
 * Servicio de dominio — construye el conjunto de personas autorizadas a
 * conducir/acceder con un vehículo en un instante dado. NUNCA incluye pases
 * de acceso rápido (esos se validan aparte, ver EvaluacionPaseService).
 */
export class ConstruccionConjuntoAutorizadoService {
  constructor(
    private readonly autorizacionPermanenteRepository: IAutorizacionPermanenteRepository,
    private readonly permisoTemporalRepository: IPermisoTemporalRepository,
  ) {}

  async construir(
    vehiculoId: string,
    propietarioId: string,
    instante: Date = new Date(),
  ): Promise<ConjuntoAutorizado> {
    const autorizados = new Map<string, MiembroConjuntoAutorizado>();

    // 1. El propietario siempre está autorizado.
    autorizados.set(propietarioId, {
      personaId: propietarioId,
      tipo: TipoAutorizacion.PERMANENTE,
    });

    // 2. Autorizaciones permanentes activas.
    const permanentes = await this.autorizacionPermanenteRepository.buscarActivasPorVehiculo(
      vehiculoId,
    );
    for (const autorizacion of permanentes) {
      if (!autorizacion.estaActiva()) continue;
      autorizados.set(autorizacion.personaId, {
        personaId: autorizacion.personaId,
        tipo: TipoAutorizacion.PERMANENTE,
      });
    }

    // 3. Permisos temporales vigentes.
    const temporales = await this.permisoTemporalRepository.buscarVigentesPorVehiculo(
      vehiculoId,
      instante,
    );
    for (const permiso of temporales) {
      if (!permiso.estaVigente(instante)) continue;
      autorizados.set(permiso.personaId, {
        personaId: permiso.personaId,
        tipo: TipoAutorizacion.TEMPORAL,
        vigenciaFin: permiso.vigencia.fin,
      });
    }

    // 4. Los pases de acceso rápido se excluyen deliberadamente.

    return {
      vehiculoId,
      propietarioId,
      autorizados: Array.from(autorizados.values()),
    };
  }
}
