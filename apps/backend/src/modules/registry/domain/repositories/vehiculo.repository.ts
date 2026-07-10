import { Vehiculo } from '../entities/vehiculo.entity';

export interface IVehiculoRepository {
  save(vehiculo: Vehiculo): Promise<Vehiculo>;
  findById(vehiculoId: string): Promise<Vehiculo | null>;
  findByPlaca(placa: string): Promise<Vehiculo | null>;
  findByPropietario(propietarioPersonaId: string): Promise<Vehiculo[]>;
  findAll(): Promise<Vehiculo[]>;
  countAll(): Promise<number>;
  update(
      vehiculoId: string,
      data: Partial<{
        placa: string;
        marca: string;
        modelo: string;
        color: string;
        anio: number;
        estadoRegistro: string;
      }>,
  ): Promise<Vehiculo>;
  delete(vehiculoId: string): Promise<void>;
}

export const VEHICULO_REPOSITORY = 'VEHICULO_REPOSITORY';