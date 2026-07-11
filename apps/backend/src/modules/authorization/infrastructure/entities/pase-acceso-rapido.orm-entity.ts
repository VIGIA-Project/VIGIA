import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pases_acceso_rapido', schema: 'authorization' })
export class PaseAccesoRapidoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pase_acceso_rapido_id' })
  id: string;

  @Column({ name: 'vehiculo_id', type: 'uuid' })
  vehiculoId: string;

  @Column({ name: 'creado_por_persona_id', type: 'uuid' })
  propietarioId: string;

  @Column({ length: 10 })
  placa: string;

  @Column({ name: 'codigo_acceso_hash' })
  codigoHash: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'CONSUMIDO', 'EXPIRADO', 'REVOCADO'],
    enumName: 'estado_pase_enum',
    name: 'estado_pase',
    default: 'ACTIVO',
  })
  estado: string;

  @Column({ name: 'vigencia_inicio', type: 'timestamptz' })
  vigenciaInicio: Date;

  @Column({ name: 'vigencia_fin', type: 'timestamptz' })
  vigenciaFin: Date;

  @Column({ name: 'nombre_conductor_externo', length: 120 })
  nombreVisitante: string;

  @Column({ name: 'cedula_conductor_externo', length: 20 })
  cedulaVisitante: string;

  @Column({ length: 255 })
  motivo: string;

  @Column({ name: 'consumido_en', type: 'timestamptz', nullable: true })
  fechaConsumo: Date | null;

  @Column({ name: 'evento_consumo_id', type: 'uuid', nullable: true })
  eventoConsumoId: string | null;

  @Column({ name: 'revocado_en', type: 'timestamptz', nullable: true })
  revocadoEn: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
