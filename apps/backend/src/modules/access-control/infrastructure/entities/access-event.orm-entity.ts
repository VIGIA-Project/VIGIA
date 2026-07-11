import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum EventDirection {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

export enum EventDecision {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  PENDING = 'PENDING',
}

@Entity('access_events', { schema: 'access_control' })
export class AccessEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'license_plate', length: 20 })
  licensePlate: string;

  @Column({ name: 'access_point_id', type: 'uuid', nullable: true })
  accessPointId: string;

  @Column({ type: 'enum', enum: EventDirection })
  direction: EventDirection;

  @Column({ type: 'enum', enum: EventDecision })
  decision: EventDecision;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
