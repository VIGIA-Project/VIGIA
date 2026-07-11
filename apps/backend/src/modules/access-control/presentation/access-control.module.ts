// presentation/access-control.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoAccesoOrmEntity } from '../infrastructure/repositories/access-event.orm-entity';
import { AccessEventRepositoryImpl } from '../infrastructure/repositories/access-event.repository.impl';
import { ACCESS_EVENT_REPOSITORY } from '../domain/repositories/access-event.repository';
import {
  CrearEventoAccesoUseCase,
  ListarEventosPendientesUseCase,
  ObtenerEventoUseCase,
  ResolverEventoManualUseCase,
  RegistrarContingenciaUseCase,
  ObtenerHistorialPlacaUseCase,
} from '../application/use-cases/access-control.use-cases';
import {
  AccessControlController,
  InvitadosController,
} from './access-control.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoAccesoOrmEntity]),
  ],
  controllers: [
    AccessControlController,
    InvitadosController,
  ],
  providers: [
    // Repository
    {
      provide: ACCESS_EVENT_REPOSITORY,
      useClass: AccessEventRepositoryImpl,
    },
    // Use Cases
    CrearEventoAccesoUseCase,
    ListarEventosPendientesUseCase,
    ObtenerEventoUseCase,
    ResolverEventoManualUseCase,
    RegistrarContingenciaUseCase,
    ObtenerHistorialPlacaUseCase,
  ],
  exports: [
    CrearEventoAccesoUseCase,
    ListarEventosPendientesUseCase,
    ObtenerEventoUseCase,
  ],
})
export class AccessControlModule {}
