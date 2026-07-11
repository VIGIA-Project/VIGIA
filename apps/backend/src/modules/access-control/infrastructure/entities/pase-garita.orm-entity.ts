import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'pases_garita', schema: 'access_control' })
export class PaseGaritaOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pase_garita_id' })
  id: string;

  @Column({ name: 'placa_vehiculo', length: 15 })
  placaVehiculo: string;

  @Column({ name: 'tipo_movimiento', length: 20 })
  tipoMovimiento: string;

  @Column({ name: 'tipo_visitante', length: 50 })
  tipoVisitante: string;

  @Column({ name: 'nombre_visitante', length: 100 })
  nombreVisitante: string;

  @Column({ name: 'documento_visitante', length: 30, nullable: true })
  documentoVisitante: string | null;

  @Column({ length: 150 })
  destino: string;

  @Column({ name: 'duracion_horas', type: 'numeric', precision: 4, scale: 2 })
  duracionHoras: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'FINALIZADO', 'EXPIRADO'],
    enumName: 'estado_pase_garita_enum',
    default: 'ACTIVO',
  })
  estado: string;

  @Column({ name: 'creado_por_guardia_id', type: 'uuid' })
  guardiaId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'finalizado_at', type: 'timestamptz', nullable: true })
  finalizadoAt: Date | null;
}
