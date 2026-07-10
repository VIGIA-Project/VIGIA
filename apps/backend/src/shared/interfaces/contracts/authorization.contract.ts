/**
 * Contrato para el BC de Authorization.
 * Otros BCs (Access Control, Biometric) SOLO deben consumir este contrato —
 * nunca importar módulos/servicios internos de `modules/authorization` directamente.
 */
export interface IAuthorizationContract {
  /**
   * Construye el conjunto de personas autorizadas a acceder con un vehículo
   * en un instante dado (propietario + autorizaciones permanentes activas +
   * permisos temporales vigentes). Excluye pases de acceso rápido.
   */
  obtenerConjuntoAutorizado(
    vehiculoId: string,
    propietarioId: string,
    instante?: Date,
  ): Promise<ConjuntoAutorizadoDTO>;

  /**
   * Valida un código de pase de acceso rápido contra una placa. NO marca el
   * pase como consumido.
   */
  validarPaseRapido(
    codigo: string,
    placa: string,
    instante?: Date,
  ): Promise<ResultadoValidacionPaseDTO>;

  /**
   * Marca un pase como consumido, asociándolo al evento de acceso que lo usó.
   */
  consumirPase(paseId: string, eventoId: string): Promise<void>;
}

export interface ConjuntoAutorizadoDTO {
  vehiculoId: string;
  propietarioId: string;
  autorizados: Array<{
    personaId: string;
    tipo: 'PERMANENTE' | 'TEMPORAL';
    vigenciaFin?: Date;
  }>;
}

export interface ResultadoValidacionPaseDTO {
  valido: boolean;
  paseId?: string;
  motivo: string;
}
