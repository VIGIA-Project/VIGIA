export enum RolAsignacion {
    PROPIETARIO = 'PROPIETARIO',
    FAMILIAR_AUTORIZADO = 'FAMILIAR_AUTORIZADO',
    CONDUCTOR_PERMANENTE = 'CONDUCTOR_PERMANENTE',
    PERSONA_AUTORIZADA = 'PERSONA_AUTORIZADA',
}

export enum EstadoAsignacion {
    ACTIVA = 'ACTIVA',
    INACTIVA = 'INACTIVA',
}

export class AsignacionRol {
    private constructor(
        public readonly asignacionRolId: string,
        public readonly personaId: string,
        public readonly vehiculoId: string,
        public readonly rol: RolAsignacion,
        public readonly estadoAsignacion: EstadoAsignacion,
        public readonly vigentDesde: Date,
        public readonly vigenteHasta: Date | undefined,
        public readonly createdAt: Date,
    ) {}

    static create(props: {
        asignacionRolId: string;
        personaId: string;
        vehiculoId: string;
        rol: RolAsignacion;
        estadoAsignacion?: EstadoAsignacion;
        vigenteDesde?: Date;
        vigenteHasta?: Date;
    }): AsignacionRol {
        return new AsignacionRol(
            props.asignacionRolId,
            props.personaId,
            props.vehiculoId,
            props.rol,
            props.estadoAsignacion ?? EstadoAsignacion.ACTIVA,
            props.vigenteDesde ?? new Date(),
            props.vigenteHasta,
            new Date(),
        );
    }

    isActiva(): boolean {
        return this.estadoAsignacion === EstadoAsignacion.ACTIVA;
    }

    isPropietario(): boolean {
        return this.rol === RolAsignacion.PROPIETARIO;
    }

    isFamiliar(): boolean {
        return this.rol === RolAsignacion.FAMILIAR_AUTORIZADO;
    }
}