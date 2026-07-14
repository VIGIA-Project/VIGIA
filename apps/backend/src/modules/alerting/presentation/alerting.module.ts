import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertingController } from './alerting.controller';
import { AlertingService } from '../application/alerting.service';
import { TypeOrmAlertaRepository } from '../infrastructure/repositories/typeorm-alerta.repository';
import { TypeOrmNotificacionRepository } from '../infrastructure/repositories/typeorm-notificacion.repository';
import { AlertaOrmEntity } from '../infrastructure/entities/alerta.orm-entity';
import { NotificacionOrmEntity } from '../infrastructure/entities/notificacion.orm-entity';
import { ALERTA_REPOSITORY, NOTIFICACION_REPOSITORY } from '@shared/constants/injection-tokens';

@Module({
  imports: [TypeOrmModule.forFeature([AlertaOrmEntity, NotificacionOrmEntity])],
  controllers: [AlertingController],
  providers: [
    AlertingService,
    {
      provide: ALERTA_REPOSITORY,
      useClass: TypeOrmAlertaRepository,
    },
    {
      provide: NOTIFICACION_REPOSITORY,
      useClass: TypeOrmNotificacionRepository,
    },
  ],
  exports: [AlertingService],
})
export class AlertingModule {}
