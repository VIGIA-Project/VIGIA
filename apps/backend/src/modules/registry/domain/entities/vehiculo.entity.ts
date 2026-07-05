import { EstadoRegistro } from './persona.entity';

export class Vehiculo {
    private constructor(
        public readonly vehiculoId: string,
        public readonly propietarioPersonaId: string,
        public readonly placa: string,
        public readonly marca: string | undefined,
        public readonly modelo: string | undefined,
        public readonly color: string | undefined,
        public readonly anio: number | undefined,
        public readonly estadoRegistro: EstadoRegistro,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static create(props: {
        vehiculoId: string;
        propietarioPersonaId: string;
        placa: string;
        marca?: string;
        modelo?: string;
        color?: string;
        anio?: number;
        estadoRegistro?: EstadoRegistro;
        createdAt?: Date;
        updatedAt?: Date;
    }): Vehiculo {
        const placaNormalizada = Vehiculo.normalizarPlaca(props.placa);

        if (!placaNormalizada) {
            throw new Error('La placa no puede estar vacía');
        }

        return new Vehiculo(
            props.vehiculoId,
            props.propietarioPersonaId,
            placaNormalizada,
            props.marca,
            props.modelo,
            props.color,
            props.anio,
            props.estadoRegistro ?? EstadoRegistro.ACTIVO,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }

    static normalizarPlaca(placa: string): string {
        return placa.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
    }

    isActivo(): boolean {
        return this.estadoRegistro === EstadoRegistro.ACTIVO;
    }
}