import { AutorizacionPermanente } from '../entities/autorizacion-permanente.entity';
import { PermisoTemporal } from '../entities/permiso-temporal.entity';
import { EstadoAutorizacion } from '../value-objects/estado-autorizacion.vo';

export interface ResultadoEvaluacionVigencia {
  vigente: boolean;
  motivo: string;
}

/**
 * Servicio de dominio — evalúa si una autorización (permanente o temporal)
 * está vigente en un instante dado.
 */
export class EvaluacionVigenciaService {
  evaluarPermanente(
    autorizacion: AutorizacionPermanente,
    instante: Date = new Date(),
  ): ResultadoEvaluacionVigencia {
    void instante;
    if (autorizacion.estaActiva()) {
      return { vigente: true, motivo: 'Autorización permanente activa' };
    }
    return {
      vigente: false,
      motivo: `Autorización permanente en estado ${autorizacion.estado}`,
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
