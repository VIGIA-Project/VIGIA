import { Injectable } from '@nestjs/common';
import {
  IAuthorizationContract,
  ConjuntoAutorizadoDTO,
  ResultadoValidacionPaseDTO,
} from '@shared/interfaces/contracts/authorization.contract';
import { AuthorizationService } from './authorization.service';

/**
 * Implementación del contrato inter-BC de Authorization. Otros BCs
 * (Access Control, Biometric) inyectan `AUTHORIZATION_CONTRACT` y consumen
 * únicamente esta interfaz — nunca `AuthorizationService` directamente.
 */
@Injectable()
export class AuthorizationContractImpl implements IAuthorizationContract {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async obtenerConjuntoAutorizado(
    vehiculoId: string,
    propietarioId: string,
    instante?: Date,
  ): Promise<ConjuntoAutorizadoDTO> {
    return this.authorizationService.obtenerConjuntoAutorizado(
      vehiculoId,
      propietarioId,
      instante,
    );
  }

  async validarPaseRapido(
    codigo: string,
    placa: string,
  ): Promise<ResultadoValidacionPaseDTO> {
    return this.authorizationService.validarPase(codigo, placa);
  }

  async obtenerPaseValidoPorPlaca(
    placa: string,
    instante?: Date,
  ): Promise<{ paseId: string } | null> {
    return this.authorizationService.obtenerPaseValidoPorPlaca(placa, instante);
  }

  async consumirPase(paseId: string, eventoId: string): Promise<void> {
    await this.authorizationService.consumirPase(paseId, eventoId);
  }
}
