import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'eventos_acceso', schema: 'access_control' })
export class EventoAccesoOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'evento_acceso_id' })
  id: string;

  @Column({ name: 'vehiculo_id', type: 'uuid', nullable: true })
  vehiculoId: string | null;

  @Column({ name: 'persona_detectada_id', type: 'uuid', nullable: true })
  personaId: string | null;

  @Column({ name: 'placa_observada', length: 10, nullable: true })
  placaCapturada: string | null;

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
    enum: ['SUCCESSFUL', 'DENIED', 'PENDING_VERIFY'],
    enumName: 'decision_operativa_enum',
  })
  decision: string;

  @Column({ name: 'motivo_codigo', length: 60 })
  motivoCodigo: string;

  @Column({ name: 'motivo_detalle', type: 'text', nullable: true })
  motivoDenegacion: string | null;

  @Column({
    name: 'origen_resolucion',
    type: 'enum',
    enum: ['AUTOMATICA', 'MANUAL', 'CONTINGENCIA'],
    enumName: 'origen_resolucion_enum',
  })
  origenResolucion: string;

  @Column({ name: 'capturado_en', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestampEvento: Date;
}
