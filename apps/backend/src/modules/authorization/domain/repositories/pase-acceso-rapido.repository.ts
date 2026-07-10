import { PaseAccesoRapido } from '../entities/pase-acceso-rapido.entity';
import { EstadoPase } from '../value-objects/estado-pase.vo';

export interface IPaseAccesoRapidoRepository {
  guardar(pase: PaseAccesoRapido): Promise<PaseAccesoRapido>;

  buscarPorId(id: string): Promise<PaseAccesoRapido | null>;

  buscarActivosPorPlaca(placa: string, instante?: Date): Promise<PaseAccesoRapido[]>;

  buscarPorVehiculoYEstado(
    vehiculoId: string,
    estado: EstadoPase,
  ): Promise<PaseAccesoRapido[]>;

  buscarPorPropietario(propietarioId: string): Promise<PaseAccesoRapido[]>;
}
