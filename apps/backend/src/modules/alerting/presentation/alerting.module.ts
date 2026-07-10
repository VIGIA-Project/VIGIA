import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertingController } from './alerting.controller';
import { AlertingService, ALERTA_REPOSITORY } from '../application/alerting.service';
import { AlertaOrmEntity } from '../infrastructure/entities/alerta.orm-entity';
import { TypeOrmAlertaRepository } from '../infrastructure/repositories/typeorm-alerta.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlertaOrmEntity])],
  controllers: [AlertingController],
  providers: [
    AlertingService,
    {
      provide: ALERTA_REPOSITORY,
      useClass: TypeOrmAlertaRepository,
    },
  ],
  exports: [AlertingService],
})
export class AlertingModule {}
