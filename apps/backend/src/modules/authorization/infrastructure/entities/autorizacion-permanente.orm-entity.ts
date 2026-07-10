import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'autorizaciones_permanentes', schema: 'authorization' })
export class AutorizacionPermanenteOrmEntity {
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
    default: 'PERMANENTE',
  })
  tipo: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVA', 'INACTIVA', 'REVOCADA', 'EXPIRADA'],
    enumName: 'estado_autorizacion_enum',
    default: 'ACTIVA',
  })
  estado: string;

  @Column({ length: 50 })
  relacion: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
