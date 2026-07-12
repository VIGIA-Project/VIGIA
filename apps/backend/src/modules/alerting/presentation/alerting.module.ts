import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertingController } from './alerting.controller';
import { AlertingService } from '../application/alerting.service';
import { TypeOrmAlertaRepository } from '../infrastructure/repositories/typeorm-alerta.repository';
import { TypeOrmNotificacionRepository } from '../infrastructure/repositories/typeorm-notificacion.repository';
import { AlertaOrmEntity } from '../infrastructure/entities/alerta.orm-entity';
import { NotificacionOrmEntity } from '../infrastructure/entities/notificacion.orm-entity';
import { ALERTA_REPOSITORY, NOTIFICACION_REPOSITORY, ALERTING_CONTRACT } from '@shared/constants/injection-tokens';
import { AlertingContractImpl } from '../application/alerting-contract.impl';

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
    {
      provide: ALERTING_CONTRACT,
      useClass: AlertingContractImpl,
    }
  ],
  exports: [AlertingService, ALERTING_CONTRACT],
})
export class AlertingModule {}
