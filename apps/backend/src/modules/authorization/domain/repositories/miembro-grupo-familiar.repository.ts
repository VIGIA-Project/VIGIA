import { MiembroGrupoFamiliar } from '../entities/miembro-grupo-familiar.entity';

export interface IMiembroGrupoFamiliarRepository {
  guardar(miembro: MiembroGrupoFamiliar): Promise<MiembroGrupoFamiliar>;

  buscarPorId(id: string): Promise<MiembroGrupoFamiliar | null>;

  buscarPorPropietario(propietarioId: string): Promise<MiembroGrupoFamiliar[]>;

  buscarActivosPorPropietario(propietarioId: string): Promise<MiembroGrupoFamiliar[]>;

  contarActivosPorPropietario(propietarioId: string): Promise<number>;

  contarActivosTotal(): Promise<number>;

  existeMiembroActivo(personaId: string, propietarioId: string): Promise<boolean>;
}
