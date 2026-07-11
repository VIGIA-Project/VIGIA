import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService, NOTIFICACION_REPOSITORY } from '../application/notification.service';
import { NotificacionOrmEntity } from '../infrastructure/entities/notificacion.orm-entity';
import { TypeOrmNotificacionRepository } from '../infrastructure/repositories/typeorm-notificacion.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificacionOrmEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: NOTIFICACION_REPOSITORY,
      useClass: TypeOrmNotificacionRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
