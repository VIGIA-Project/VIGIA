/**
 * Estado de un PaseAccesoRapido. Todas las transiciones desde ACTIVO son terminales.
 */
export enum EstadoPase {
  ACTIVO = 'ACTIVO',
  CONSUMIDO = 'CONSUMIDO',
  EXPIRADO = 'EXPIRADO',
  REVOCADO = 'REVOCADO',
}

const TRANSICIONES_VALIDAS_PASE: Record<EstadoPase, EstadoPase[]> = {
  [EstadoPase.ACTIVO]: [EstadoPase.CONSUMIDO, EstadoPase.EXPIRADO, EstadoPase.REVOCADO],
  [EstadoPase.CONSUMIDO]: [],
  [EstadoPase.EXPIRADO]: [],
  [EstadoPase.REVOCADO]: [],
};

export function esTransicionPaseValida(desde: EstadoPase, hacia: EstadoPase): boolean {
  return TRANSICIONES_VALIDAS_PASE[desde].includes(hacia);
}
