import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'perfiles_biometricos', schema: 'biometric' })
export class PerfilBiometricoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'perfil_biometrico_id' })
  perfilBiometricoId: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  personaId: string;

  @Column({
    name: 'estado_disponibilidad',
    type: 'enum',
    enum: ['DISPONIBLE', 'NO_DISPONIBLE', 'PENDIENTE_CAPTURA'],
    enumName: 'estado_disponibilidad_biometrica_enum',
    default: 'PENDIENTE_CAPTURA',
  })
  estadoDisponibilidad: string;

  @Column({ name: 'ultima_actualizacion_biometrica', type: 'timestamptz', nullable: true })
  ultimaActualizacionBiometrica: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
