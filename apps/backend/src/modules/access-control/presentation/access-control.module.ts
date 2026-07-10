import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlController } from './access-control.controller';
import { AccessControlService, EVENTO_ACCESO_REPOSITORY } from '../application/access-control.service';
import { EventoAccesoOrmEntity } from '../infrastructure/entities/evento-acceso.orm-entity';
import { TypeOrmEventoAccesoRepository } from '../infrastructure/repositories/typeorm-evento-acceso.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventoAccesoOrmEntity])],
  controllers: [AccessControlController],
  providers: [
    AccessControlService,
    {
      provide: EVENTO_ACCESO_REPOSITORY,
      useClass: TypeOrmEventoAccesoRepository,
    },
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
