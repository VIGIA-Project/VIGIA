import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'personas', schema: 'registry' })
export class PersonaOrmEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'persona_id' })
    personaId: string;

    @Column({
        name: 'identificacion_tipo',
        type: 'enum',
        enum: ['CEDULA', 'PASAPORTE', 'RUC'],
        enumName: 'identificacion_tipo_enum',
    })
    identificacionTipo: string;

    @Column({ name: 'identificacion_numero', length: 20 })
    identificacionNumero: string;

    @Column({ length: 120 })
    nombres: string;

    @Column({ length: 120 })
    apellidos: string;

    @Column({ name: 'correo_institucional', length: 160, nullable: true })
    correoInstitucional: string | null;

    @Column({ name: 'telefono_contacto', length: 30, nullable: true })
    telefonoContacto: string | null;

    @Column({
        name: 'estado_registro',
        type: 'enum',
        enum: ['ACTIVO', 'INACTIVO'],
        enumName: 'estado_registro_enum',
        default: 'ACTIVO',
    })
    estadoRegistro: string;

    @Column({
        name: 'estado_biometrico',
        type: 'varchar',
        length: 20,
        default: 'PENDIENTE',
    })
    estadoBiometrico: string;

    @Column({ name: 'rol_institucional', length: 100, nullable: true })
    rolInstitucional: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @Column({ name: 'created_by', nullable: true, type: 'uuid' })
    createdBy: string | null;

    @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
    updatedBy: string | null;
}