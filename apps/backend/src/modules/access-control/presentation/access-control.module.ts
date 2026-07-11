import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlController } from './access-control.controller';
import { AccessControlService, EVENTO_ACCESO_REPOSITORY, PASE_GARITA_REPOSITORY } from '../application/access-control.service';
import { EventoAccesoOrmEntity } from '../infrastructure/entities/evento-acceso.orm-entity';
import { PaseGaritaOrmEntity } from '../infrastructure/entities/pase-garita.orm-entity';
import { TypeOrmEventoAccesoRepository } from '../infrastructure/repositories/typeorm-evento-acceso.repository';
import { TypeOrmPaseGaritaRepository } from '../infrastructure/repositories/typeorm-pase-garita.repository';
import { NotificationModule } from '../../notification/presentation/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoAccesoOrmEntity, PaseGaritaOrmEntity]),
    NotificationModule,
  ],
  controllers: [AccessControlController],
  providers: [
    AccessControlService,
    {
      provide: EVENTO_ACCESO_REPOSITORY,
      useClass: TypeOrmEventoAccesoRepository,
    },
    {
      provide: PASE_GARITA_REPOSITORY,
      useClass: TypeOrmPaseGaritaRepository,
    },
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
