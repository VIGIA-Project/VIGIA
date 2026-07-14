import { Persona } from '../entities/persona.entity';

export interface IPersonaRepository {
    save(persona: Persona): Promise<Persona>;
    findById(personaId: string): Promise<Persona | null>;
    findByIdentificacion(
        tipo: string,
        numero: string,
    ): Promise<Persona | null>;
    findByCorreo(correoInstitucional: string): Promise<Persona | null>;
    findAll(): Promise<Persona[]>;
    contarTotal(): Promise<number>;
    findSinPerfilBiometrico(): Promise<Persona[]>;
    update(
        personaId: string,
        data: Partial<{
            nombres: string;
            apellidos: string;
            correoInstitucional: string;
            telefonoContacto: string;
            estadoRegistro: string;
            estadoBiometrico: string;
        }>,
    ): Promise<Persona>;
    delete(personaId: string): Promise<void>;
}

export const PERSONA_REPOSITORY = 'PERSONA_REPOSITORY';