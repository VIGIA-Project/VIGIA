/**
 * Ciclo de vida de una Alerta: GENERADA -> ENTREGADA -> ATENDIDA.
 * "No resuelta" (para conteos) equivale a estado != ATENDIDA.
 */
export enum EstadoAtencionAlerta {
  GENERADA = 'GENERADA',
  ENTREGADA = 'ENTREGADA',
  ATENDIDA = 'ATENDIDA',
}
