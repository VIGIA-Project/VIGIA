import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pases_acceso_rapido', schema: 'authorization' })
export class PaseAccesoRapidoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'vehiculo_id', type: 'uuid' })
  vehiculoId: string;

  @Column({ name: 'propietario_id', type: 'uuid' })
  propietarioId: string;

  @Column({ length: 10 })
  placa: string;

  @Column({ name: 'codigo_hash' })
  codigoHash: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'CONSUMIDO', 'EXPIRADO', 'REVOCADO'],
    enumName: 'estado_pase_enum',
    default: 'ACTIVO',
  })
  estado: string;

  @Column({ name: 'vigencia_inicio', type: 'timestamptz' })
  vigenciaInicio: Date;

  @Column({ name: 'vigencia_fin', type: 'timestamptz' })
  vigenciaFin: Date;

  @Column({ name: 'nombre_visitante', length: 160 })
  nombreVisitante: string;

  @Column({ name: 'cedula_visitante', length: 20, nullable: true })
  cedulaVisitante: string | null;

  @Column({ length: 255 })
  motivo: string;

  @Column({ name: 'fecha_consumo', type: 'timestamptz', nullable: true })
  fechaConsumo: Date | null;

  @Column({ name: 'evento_consumo_id', type: 'uuid', nullable: true })
  eventoConsumoId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
