import { PersonaResponseDto } from '../dtos/persona.dto';
import { VehiculoResponseDto } from '../dtos/vehiculo.dto';
import { AsignacionRolResponseDto } from '../dtos/asignacion-rol.dto';

/**
 * IRegistryPort
 * Contrato que otros BCs usan para consultar el Registry.
 * Access Control, Authorization y Biometric SOLO acceden
 * a Registry a través de este puerto — nunca directamente.
 */
export interface IRegistryPort {
    findVehiculoByPlaca(placa: string): Promise<VehiculoResponseDto | null>;
    findVehiculoById(vehiculoId: string): Promise<VehiculoResponseDto | null>;
    findPersonaById(personaId: string): Promise<PersonaResponseDto | null>;
    findPropietarioByVehiculo(vehiculoId: string): Promise<PersonaResponseDto | null>;
    findPersonasAutorizadasByVehiculo(vehiculoId: string): Promise<AsignacionRolResponseDto[]>;
    findGrupoFamiliarByVehiculo(vehiculoId: string): Promise<AsignacionRolResponseDto[]>;
    getEstadoBiometrico(personaId: string): Promise<'PENDIENTE' | 'COMPLETO' | null>;
}

export const REGISTRY_PORT = 'REGISTRY_PORT';