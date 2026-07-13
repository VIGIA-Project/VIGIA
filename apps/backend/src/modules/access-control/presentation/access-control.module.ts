import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from '../application/access-control.service';
import { TypeOrmEventoAccesoRepository } from '../infrastructure/repositories/typeorm-evento-acceso.repository';
import { EventoAccesoOrmEntity } from '../infrastructure/entities/evento-acceso.orm-entity';
import { EVENTO_ACCESO_REPOSITORY } from '@shared/constants/injection-tokens';
import { RegistryModule } from '../../registry/presentation/registry.module';
import { AlertingModule } from '../../alerting/presentation/alerting.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventoAccesoOrmEntity]), RegistryModule, AlertingModule],
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
