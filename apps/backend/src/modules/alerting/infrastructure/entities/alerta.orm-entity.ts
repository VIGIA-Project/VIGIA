import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'alertas', schema: 'alerting' })
export class AlertaOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'alerta_id' })
  id: string;

  @Column({ name: 'causa_origen', length: 80 })
  causaOrigen: string;

  @Column({ name: 'referencia_origen_id', type: 'uuid' })
  referenciaOrigenId: string;

  @Column({ name: 'vehiculo_id', type: 'uuid', nullable: true })
  vehiculoId: string | null;

  @Column({
    type: 'enum',
    enum: ['ALTA', 'MEDIA', 'INFORMATIVA'],
    enumName: 'severidad_alerta_enum',
  })
  severidad: string;

  @Column({
    name: 'estado_atencion',
    type: 'enum',
    enum: ['GENERADA', 'ENTREGADA', 'ATENDIDA'],
    enumName: 'estado_atencion_alerta_enum',
    default: 'GENERADA',
  })
  estadoAtencion: string;

  @Column({ name: 'mensaje_resumen', type: 'text' })
  mensajeResumen: string;

  @Column({ name: 'generada_en', type: 'timestamptz' })
  generadaEn: Date;

  @Column({ name: 'atendida_en', type: 'timestamptz', nullable: true })
  atendidaEn: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
