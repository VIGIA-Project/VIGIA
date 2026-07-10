export enum EstadoRegistro {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
}

export enum IdentificacionTipo {
    CEDULA = 'CEDULA',
    PASAPORTE = 'PASAPORTE',
    RUC = 'RUC',
}

export enum EstadoBiometrico {
    PENDIENTE = 'PENDIENTE',
    COMPLETO = 'COMPLETO',
}

export class Persona {
    private constructor(
        public readonly personaId: string,
        public readonly identificacionTipo: IdentificacionTipo,
        public readonly identificacionNumero: string,
        public readonly nombres: string,
        public readonly apellidos: string,
        public readonly correoInstitucional: string | undefined,
        public readonly telefonoContacto: string | undefined,
        public readonly rolInstitucional: string | undefined,
        public readonly estadoRegistro: EstadoRegistro,
        public readonly estadoBiometrico: EstadoBiometrico,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static create(props: {
        personaId: string;
        identificacionTipo: IdentificacionTipo;
        identificacionNumero: string;
        nombres: string;
        apellidos: string;
        correoInstitucional?: string;
        telefonoContacto?: string;
        rolInstitucional?: string;
        estadoRegistro?: EstadoRegistro;
        estadoBiometrico?: EstadoBiometrico;
        createdAt?: Date;
        updatedAt?: Date;
    }): Persona {
        if (!props.nombres.trim()) {
            throw new Error('El nombre no puede estar vacío');
        }
        if (!props.apellidos.trim()) {
            throw new Error('El apellido no puede estar vacío');
        }
        if (!props.identificacionNumero.trim()) {
            throw new Error('El número de identificación no puede estar vacío');
        }

        return new Persona(
            props.personaId,
            props.identificacionTipo,
            props.identificacionNumero.trim(),
            props.nombres.trim(),
            props.apellidos.trim(),
            props.correoInstitucional,
            props.telefonoContacto,
            props.rolInstitucional,
            props.estadoRegistro ?? EstadoRegistro.ACTIVO,
            props.estadoBiometrico ?? EstadoBiometrico.PENDIENTE,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }

    getNombreCompleto(): string {
        return `${this.nombres} ${this.apellidos}`;
    }

    isActivo(): boolean {
        return this.estadoRegistro === EstadoRegistro.ACTIVO;
    }

    tieneEnrollmentCompleto(): boolean {
        return this.estadoBiometrico === EstadoBiometrico.COMPLETO;
    }
}