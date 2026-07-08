import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'asignaciones_rol', schema: 'registry' })
export class AsignacionRolOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'asignacion_rol_id' })
    asignacionRolId: string;

    @Column({ name: 'persona_id', type: 'uuid' })
    personaId: string;

    @Column({ name: 'vehiculo_id', type: 'uuid' })
    vehiculoId: string;

    @Column({
        name: 'rol_institucional',
        type: 'varchar',
        length: 50,
    })
    rol: string;

    @Column({
        name: 'estado_asignacion',
        type: 'enum',
        enum: ['ACTIVA', 'INACTIVA'],
        enumName: 'estado_asignacion_enum',
        default: 'ACTIVA',
    })
    estadoAsignacion: string;

    @Column({ name: 'vigente_desde', type: 'timestamptz', default: () => 'NOW()' })
    vigenteDesde: Date;

    @Column({ name: 'vigente_hasta', type: 'timestamptz', nullable: true })
    vigenteHasta: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}