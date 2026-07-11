import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'eventos_acceso', schema: 'access_control' })
export class EventoAccesoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'evento_acceso_id' })
  eventoAccesoId: string;

  @Column({ name: 'vehiculo_id', type: 'uuid', nullable: true })
  vehiculoId: string | null;

  @Column({ name: 'persona_detectada_id', type: 'uuid', nullable: true })
  personaDetectadaId: string | null;

  @Column({ name: 'placa_observada', length: 10 })
  placaObservada: string;

  @Column({
    name: 'tipo_movimiento',
    type: 'enum',
    enum: ['ENTRADA', 'SALIDA'],
    enumName: 'tipo_movimiento_enum',
  })
  tipoMovimiento: string;

  @Column({
    name: 'decision_operativa',
    type: 'enum',
    enum: ['SUCCESSFUL', 'PENDING_VERIFY', 'DENIED'],
    enumName: 'decision_operativa_enum',
  })
  decisionOperativa: string;

  @Column({ name: 'motivo_codigo', length: 60 })
  motivoCodigo: string;

  @Column({ name: 'motivo_detalle', type: 'text', nullable: true })
  motivoDetalle: string | null;

  @Column({
    name: 'origen_resolucion',
    type: 'enum',
    enum: ['AUTOMATICA', 'MANUAL', 'CONTINGENCIA', 'INVITADO'],
    enumName: 'origen_resolucion_enum',
  })
  origenResolucion: string;

  @Column({ name: 'capturado_en', type: 'timestamptz' })
  capturadoEn: Date;

  @Column({ name: 'resuelto_en', type: 'timestamptz', nullable: true })
  resueltoEn: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
