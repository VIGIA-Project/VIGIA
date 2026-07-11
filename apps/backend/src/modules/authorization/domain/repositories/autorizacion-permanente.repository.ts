import { AutorizacionPermanente } from '../entities/autorizacion-permanente.entity';

export interface IAutorizacionPermanenteRepository {
  guardar(autorizacion: AutorizacionPermanente): Promise<AutorizacionPermanente>;

  buscarPorId(id: string): Promise<AutorizacionPermanente | null>;

  buscarPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]>;

  buscarActivasPorVehiculo(vehiculoId: string): Promise<AutorizacionPermanente[]>;

  buscarPorPersonaYVehiculo(
    personaId: string,
    vehiculoId: string,
  ): Promise<AutorizacionPermanente | null>;

  existeAutorizacionActiva(personaId: string, vehiculoId: string): Promise<boolean>;

  buscarPorPropietario(propietarioId: string): Promise<AutorizacionPermanente[]>;

  buscarTodas(): Promise<AutorizacionPermanente[]>;
}
