import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'vehiculos', schema: 'registry' })
export class VehiculoOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'vehiculo_id' })
    vehiculoId: string;

    @Column({ name: 'propietario_persona_id', type: 'uuid' })
    propietarioPersonaId: string;

    @Column({ length: 10 })
    placa: string;

    @Column({ length: 60, nullable: true })
    marca: string | null;

    @Column({ length: 60, nullable: true })
    modelo: string | null;

    @Column({ length: 40, nullable: true })
    color: string | null;

    @Column({ type: 'smallint', nullable: true })
    anio: number | null;

    @Column({
        name: 'estado_registro',
        type: 'enum',
        enum: ['ACTIVO', 'INACTIVO'],
        enumName: 'estado_registro_enum',
        default: 'ACTIVO',
    })
    estadoRegistro: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'created_by', nullable: true, type: 'uuid' })
    createdBy: string | null;

    @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
    updatedBy: string | null;
}