import { AsignacionRol, RolAsignacion } from '../entities/asignacion-rol.entity';

export interface IAsignacionRolRepository {
    save(asignacion: AsignacionRol): Promise<AsignacionRol>;
    findAll(): Promise<AsignacionRol[]>;
    findByVehiculo(vehiculoId: string): Promise<AsignacionRol[]>;
    findByPersona(personaId: string): Promise<AsignacionRol[]>;
    findByVehiculoYRol(
        vehiculoId: string,
        rol: RolAsignacion,
    ): Promise<AsignacionRol[]>;
    findGrupoFamiliar(vehiculoId: string): Promise<AsignacionRol[]>;
    desactivar(asignacionRolId: string): Promise<void>;
}

export const ASIGNACION_ROL_REPOSITORY = 'ASIGNACION_ROL_REPOSITORY';