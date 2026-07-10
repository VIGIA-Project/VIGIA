import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'autorizaciones_permanentes', schema: 'authorization' })
export class AutorizacionPermanenteOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'autorizacion_permanente_id' })
  id: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  personaId: string;

  @Column({ name: 'vehiculo_id', type: 'uuid' })
  vehiculoId: string;

  @Column({ name: 'otorgado_por_persona_id', type: 'uuid' })
  propietarioId: string;

  @Column({
    name: 'tipo_autorizacion',
    type: 'enum',
    enum: ['PERMANENTE', 'TEMPORAL'],
    enumName: 'tipo_autorizacion_enum',
    default: 'PERMANENTE',
  })
  tipo: string;

  @Column({
    name: 'estado_autorizacion',
    type: 'enum',
    enum: ['ACTIVA', 'INACTIVA', 'REVOCADA', 'EXPIRADA'],
    enumName: 'estado_autorizacion_enum',
    default: 'ACTIVA',
  })
  estado: string;

  @Column({ name: 'motivo_estado', type: 'text', nullable: true })
  relacion: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
