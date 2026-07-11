import { PermisoTemporal } from '../entities/permiso-temporal.entity';

export interface IPermisoTemporalRepository {
  guardar(permiso: PermisoTemporal): Promise<PermisoTemporal>;

  buscarPorId(id: string): Promise<PermisoTemporal | null>;

  buscarVigentesPorVehiculo(
    vehiculoId: string,
    instante?: Date,
  ): Promise<PermisoTemporal[]>;

  buscarPorPersonaYVehiculo(
    personaId: string,
    vehiculoId: string,
  ): Promise<PermisoTemporal[]>;

  buscarPorPersona(personaId: string): Promise<PermisoTemporal[]>;

  buscarProximosAExpirar(diasVentana: number): Promise<PermisoTemporal[]>;

  buscarPorPropietario(propietarioId: string): Promise<PermisoTemporal[]>;

  buscarTodos(): Promise<PermisoTemporal[]>;
}
