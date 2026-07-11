import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertOrmEntity } from '../infrastructure/entities/alert.orm-entity';
import { AlertingService } from '../application/alerting.service';
import { AlertingController } from './alerting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertOrmEntity])],
  controllers: [AlertingController],
  providers: [AlertingService],
  exports: [AlertingService],
})
export class AlertingModule {}
