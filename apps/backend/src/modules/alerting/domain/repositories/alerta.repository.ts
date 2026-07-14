import { Alerta } from '../entities/alerta.entity';

export interface IAlertaRepository {
  guardar(alerta: Alerta): Promise<Alerta>;

  buscarPorId(id: string): Promise<Alerta | null>;

  buscarRecientes(limite: number): Promise<Alerta[]>;

  contarNoResueltas(): Promise<number>;

  /** Busca una alerta no atendida para la misma causa+referencia — usado para idempotencia al generar alertas automáticas. */
  buscarPendientePorCausaYReferencia(causaOrigen: string, referenciaOrigenId: string): Promise<Alerta | null>;
}
