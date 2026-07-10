import { IPaseAccesoRapidoRepository } from '../repositories/pase-acceso-rapido.repository';
import { CodigoAccesoTemporal } from '../value-objects/codigo-acceso-temporal.vo';

export interface ResultadoEvaluacionPase {
  valido: boolean;
  paseId?: string;
  motivo: string;
}

/**
 * Servicio de dominio — valida un código de pase de acceso rápido contra una
 * placa en un instante dado. NO marca el pase como consumido — eso es
 * responsabilidad del BC Access Control al registrar el evento de ingreso.
 */
export class EvaluacionPaseService {
  constructor(private readonly paseAccesoRapidoRepository: IPaseAccesoRapidoRepository) {}

  async evaluar(
    codigoPlano: string,
    placa: string,
    instante: Date = new Date(),
  ): Promise<ResultadoEvaluacionPase> {
    const pasesActivos = await this.paseAccesoRapidoRepository.buscarActivosPorPlaca(
      placa,
      instante,
    );

    if (pasesActivos.length === 0) {
      return { valido: false, motivo: 'No existen pases activos para esta placa' };
    }

    for (const pase of pasesActivos) {
      const codigo = CodigoAccesoTemporal.desdeHash(pase.codigoHash);
      const coincide = await codigo.validar(codigoPlano);
      if (!coincide) continue;

      if (!pase.estaDisponible(instante)) {
        return { valido: false, motivo: 'El pase encontrado ya expiró' };
      }

      return { valido: true, paseId: pase.id, motivo: 'Código válido' };
    }

    return { valido: false, motivo: 'Código inválido' };
  }
}
