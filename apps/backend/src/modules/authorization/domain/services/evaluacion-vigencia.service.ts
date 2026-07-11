import { MiembroGrupoFamiliar } from '../entities/miembro-grupo-familiar.entity';
import { PermisoTemporal } from '../entities/permiso-temporal.entity';
import { EstadoAutorizacion } from '../value-objects/estado-autorizacion.vo';

export interface ResultadoEvaluacionVigencia {
  vigente: boolean;
  motivo: string;
}

/**
 * Servicio de dominio — evalúa si una autorización (miembro del grupo
 * familiar o permiso temporal) está vigente en un instante dado.
 */
export class EvaluacionVigenciaService {
  evaluarMiembroGrupoFamiliar(
    miembro: MiembroGrupoFamiliar,
    instante: Date = new Date(),
  ): ResultadoEvaluacionVigencia {
    void instante;
    if (miembro.estaActiva()) {
      return { vigente: true, motivo: 'Miembro del grupo familiar activo' };
    }
    return {
      vigente: false,
      motivo: `Miembro del grupo familiar en estado ${miembro.estado}`,
    };
  }

  evaluarTemporal(
    permiso: PermisoTemporal,
    instante: Date = new Date(),
  ): ResultadoEvaluacionVigencia {
    if (permiso.estado !== EstadoAutorizacion.ACTIVA) {
      return { vigente: false, motivo: `Permiso temporal en estado ${permiso.estado}` };
    }
    if (!permiso.vigencia.estaVigente(instante)) {
      return { vigente: false, motivo: 'Permiso temporal fuera de vigencia' };
    }
    return { vigente: true, motivo: 'Permiso temporal activo y vigente' };
  }
}
