// infrastructure/repositories/access-event.orm-entity.ts
import {
  Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import {
  TipoMovimiento, DecisionOperativa, OrigenResolucion,
} from '../../domain/entities/access-event.entity';

@Entity({ schema: 'access_control', name: 'eventos_acceso' })
export class EventoAccesoOrmEntity {
  @PrimaryColumn({ name: 'evento_acceso_id', type: 'uuid' })
  eventoAccesoId: string;

  @Column({ name: 'vehiculo_id', type: 'uuid', nullable: true })
  vehiculoId: string | null;

  @Column({ name: 'persona_detectada_id', type: 'uuid', nullable: true })
  personaDetectadaId: string | null;

  @Column({ name: 'placa_observada', type: 'varchar', length: 15 })
  placaObservada: string;

  @Column({
    name: 'tipo_movimiento',
    type: 'enum',
    enum: TipoMovimiento,
    enumName: 'tipo_movimiento_enum',
  })
  tipoMovimiento: TipoMovimiento;

  @Column({
    name: 'decision_operativa',
    type: 'enum',
    enum: DecisionOperativa,
    enumName: 'decision_operativa_enum',
    default: DecisionOperativa.PENDING_VERIFY,
  })
  decisionOperativa: DecisionOperativa;

  @Column({ name: 'motivo_codigo', type: 'varchar', length: 80, nullable: true })
  motivoCodigo: string | null;

  @Column({ name: 'motivo_detalle', type: 'text', nullable: true })
  motivoDetalle: string | null;

  @Column({
    name: 'origen_resolucion',
    type: 'enum',
    enum: OrigenResolucion,
    enumName: 'origen_resolucion_enum',
    nullable: true,
  })
  origenResolucion: OrigenResolucion | null;

  @Column({ name: 'punto_control_id', type: 'uuid', nullable: true })
  puntoControlId: string | null;

  @Column({ name: 'carril', type: 'varchar', length: 20, nullable: true })
  carril: string | null;

  @Column({ name: 'score_biometrico', type: 'numeric', precision: 5, scale: 4, nullable: true })
  scoreBiometrico: number | null;

  @Column({ name: 'umbral_aplicado', type: 'numeric', precision: 5, scale: 4, default: 0.75 })
  umbralAplicado: number;

  @Column({ name: 'evidencia_resumen', type: 'text', nullable: true })
  evidenciaResumen: string | null;

  @Column({ name: 'capturado_en', type: 'timestamptz', default: () => 'NOW()' })
  capturadoEn: Date;

  @Column({ name: 'resuelto_en', type: 'timestamptz', nullable: true })
  resueltoEn: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
