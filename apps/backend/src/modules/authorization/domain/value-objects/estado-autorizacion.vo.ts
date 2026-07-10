/**
 * Estado de una AutorizacionPermanente o PermisoTemporal.
 * NO incluye PROGRAMADO — fuera del dominio actual.
 */
export enum EstadoAutorizacion {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  REVOCADA = 'REVOCADA',
  EXPIRADA = 'EXPIRADA',
}

const TRANSICIONES_VALIDAS: Record<EstadoAutorizacion, EstadoAutorizacion[]> = {
  [EstadoAutorizacion.ACTIVA]: [
    EstadoAutorizacion.REVOCADA,
    EstadoAutorizacion.EXPIRADA,
    EstadoAutorizacion.INACTIVA,
  ],
  [EstadoAutorizacion.INACTIVA]: [EstadoAutorizacion.ACTIVA],
  [EstadoAutorizacion.REVOCADA]: [],
  [EstadoAutorizacion.EXPIRADA]: [],
};

export function esTransicionValida(
  desde: EstadoAutorizacion,
  hacia: EstadoAutorizacion,
): boolean {
  return TRANSICIONES_VALIDAS[desde].includes(hacia);
}
