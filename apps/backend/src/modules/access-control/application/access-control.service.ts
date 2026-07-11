import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessEventOrmEntity, EventDirection, EventDecision } from '../infrastructure/entities/access-event.orm-entity';

export interface CreateEventDto {
  licensePlate: string;
  direction: EventDirection;
  decision: EventDecision;
  reason?: string;
  accessPointId?: string;
  vehicleId?: string;
  ownerId?: string;
}

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessEventOrmEntity)
    private readonly accessEventRepository: Repository<AccessEventOrmEntity>,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<AccessEventOrmEntity> {
    const event = this.accessEventRepository.create(dto);
    return this.accessEventRepository.save(event);
  }

  async getPendingEvents(): Promise<AccessEventOrmEntity[]> {
    return this.accessEventRepository.find({
      where: { decision: EventDecision.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async getRecentEvents(limit: number = 20): Promise<AccessEventOrmEntity[]> {
    return this.accessEventRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getAllEvents(): Promise<AccessEventOrmEntity[]> {
    return this.accessEventRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
