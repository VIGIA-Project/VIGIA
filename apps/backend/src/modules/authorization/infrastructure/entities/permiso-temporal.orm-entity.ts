import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'permisos_temporales', schema: 'authorization' })
export class PermisoTemporalOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  personaId: string;

  @Column({ name: 'vehiculo_id', type: 'uuid' })
  vehiculoId: string;

  @Column({ name: 'propietario_id', type: 'uuid' })
  propietarioId: string;

  @Column({
    type: 'enum',
    enum: ['PERMANENTE', 'TEMPORAL'],
    enumName: 'tipo_autorizacion_enum',
    default: 'TEMPORAL',
  })
  tipo: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVA', 'INACTIVA', 'REVOCADA', 'EXPIRADA'],
    enumName: 'estado_autorizacion_enum',
    default: 'ACTIVA',
  })
  estado: string;

  @Column({ name: 'vigencia_inicio', type: 'timestamptz' })
  vigenciaInicio: Date;

  @Column({ name: 'vigencia_fin', type: 'timestamptz' })
  vigenciaFin: Date;

  @Column({ length: 255 })
  motivo: string;

  @Column({ name: 'fecha_revocacion', type: 'timestamptz', nullable: true })
  fechaRevocacion: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
