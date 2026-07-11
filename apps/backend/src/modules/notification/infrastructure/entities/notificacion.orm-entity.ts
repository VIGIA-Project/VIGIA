import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'notificaciones', schema: 'notification' })
export class NotificacionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'notificacion_id' })
  id: string;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  subtitulo: string;

  @Column({
    type: 'enum',
    enum: ['ALTA', 'MEDIA', 'INFORMATIVA'],
    enumName: 'severidad_notificacion_enum',
    default: 'INFORMATIVA',
  })
  severidad: string;

  @Column({ name: 'destinatario_rol', length: 50, nullable: true })
  destinatarioRol: string | null;

  @Column({ name: 'destinatario_persona_id', type: 'uuid', nullable: true })
  destinatarioPersonaId: string | null;

  @Column({ default: false })
  leida: boolean;

  @Column({ name: 'referencia_id', type: 'uuid', nullable: true })
  referenciaId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
