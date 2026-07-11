import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertOrmEntity, AlertStatus, AlertType } from '../infrastructure/entities/alert.orm-entity';

export interface CreateAlertDto {
  alertTitle: string;
  alertDescription: string;
  alertType: AlertType;
  referenceEventId?: string;
}

export interface ResolveAlertDto {
  resolutionNotes?: string;
}

@Injectable()
export class AlertingService {
  constructor(
    @InjectRepository(AlertOrmEntity)
    private readonly alertRepository: Repository<AlertOrmEntity>,
  ) {}

  async createAlert(dto: CreateAlertDto): Promise<AlertOrmEntity> {
    const alert = this.alertRepository.create(dto);
    return this.alertRepository.save(alert);
  }

  async getActiveAlerts(): Promise<AlertOrmEntity[]> {
    return this.alertRepository.find({
      where: { status: AlertStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async resolveAlert(id: string, userId: string, dto?: ResolveAlertDto): Promise<AlertOrmEntity> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alerta con id ${id} no encontrada`);
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = userId;
    if (dto?.resolutionNotes) {
      alert.resolutionNotes = dto.resolutionNotes;
    }

    return this.alertRepository.save(alert);
  }
}
