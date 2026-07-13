import { EventoAcceso } from '../entities/evento-acceso.entity';

export interface IEventoAccesoRepository {
  guardar(evento: EventoAcceso): Promise<EventoAcceso>;

  buscarPorId(id: string): Promise<EventoAcceso | null>;

  buscarRecientes(limite: number): Promise<EventoAcceso[]>;

  buscarPorVehiculo(vehiculoId: string, limite: number): Promise<EventoAcceso[]>;

  contarPorRangoFecha(desde: Date, hasta: Date): Promise<number>;

  /**
   * Vehículos que ingresaron por contingencia hoy y todavía no registran
   * una SALIDA posterior — es decir, "invitados" activos dentro del campus.
   */
  buscarInvitadosActivos(): Promise<EventoAcceso[]>;
}
