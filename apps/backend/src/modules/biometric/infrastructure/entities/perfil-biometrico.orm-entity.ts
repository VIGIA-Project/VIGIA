import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'perfiles_biometricos', schema: 'biometric' })
export class PerfilBiometricoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'perfil_biometrico_id' })
  id: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  personaId: string;

  @Column({
    name: 'estado_disponibilidad',
    type: 'enum',
    enum: ['DISPONIBLE', 'NO_DISPONIBLE'],
    enumName: 'estado_disponibilidad_biometrica_enum',
    default: 'DISPONIBLE',
  })
  estado: string;
}
