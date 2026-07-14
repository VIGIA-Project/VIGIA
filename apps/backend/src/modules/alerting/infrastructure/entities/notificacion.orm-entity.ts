import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notificaciones', schema: 'alerting' })
export class NotificacionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'notificacion_id' })
  notificacionId: string;

  @Column({ name: 'alerta_id', type: 'uuid' })
  alertaId: string;

  @Column({ name: 'destinatario_persona_id', type: 'uuid' })
  destinatarioPersonaId: string;

  @Column({
    type: 'enum',
    enum: ['DASHBOARD', 'TELEGRAM'],
    enumName: 'canal_notificacion_enum',
  })
  canal: string;

  @Column({ length: 160 })
  titulo: string;

  @Column({
    name: 'estado_entrega',
    type: 'enum',
    enum: ['PENDIENTE', 'ENVIADA', 'FALLIDA'],
    enumName: 'estado_entrega_notificacion_enum',
    default: 'PENDIENTE',
  })
  estadoEntrega: string;

  @Column({ name: 'contenido_resumen', type: 'text' })
  contenidoResumen: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ name: 'leida_en', type: 'timestamptz', nullable: true })
  leidaEn: Date | null;

  @Column({ name: 'enviada_en', type: 'timestamptz', nullable: true })
  enviadaEn: Date | null;
}
