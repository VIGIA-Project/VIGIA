import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistryModule } from '../../registry/presentation/registry.module';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from '../application/authorization.service';
import { ConstruccionConjuntoAutorizadoService } from '../domain/services/construccion-conjunto-autorizado.service';
import { EvaluacionPaseService } from '../domain/services/evaluacion-pase.service';
import { TypeOrmMiembroGrupoFamiliarRepository } from '../infrastructure/repositories/typeorm-miembro-grupo-familiar.repository';
import { TypeOrmPermisoTemporalRepository } from '../infrastructure/repositories/typeorm-permiso-temporal.repository';
import { TypeOrmPaseAccesoRapidoRepository } from '../infrastructure/repositories/typeorm-pase-acceso-rapido.repository';
import { MiembroGrupoFamiliarOrmEntity } from '../infrastructure/entities/miembro-grupo-familiar.orm-entity';
import { PermisoTemporalOrmEntity } from '../infrastructure/entities/permiso-temporal.orm-entity';
import { PaseAccesoRapidoOrmEntity } from '../infrastructure/entities/pase-acceso-rapido.orm-entity';
import { AuthorizationContractImpl } from '../application/authorization-contract.impl';
import {
  MIEMBRO_GRUPO_FAMILIAR_REPOSITORY,
  PERMISO_TEMPORAL_REPOSITORY,
  PASE_ACCESO_RAPIDO_REPOSITORY,
  AUTHORIZATION_CONTRACT,
} from '@shared/constants/injection-tokens';
import { IMiembroGrupoFamiliarRepository } from '../domain/repositories/miembro-grupo-familiar.repository';
import { IPermisoTemporalRepository } from '../domain/repositories/permiso-temporal.repository';
import { IPaseAccesoRapidoRepository } from '../domain/repositories/pase-acceso-rapido.repository';
import { AuthorizationSeedService } from '../infrastructure/seeds/authorization-seed.service';
import { UserOrmEntity } from '@core/auth/infrastructure/user.orm-entity';
import { PersonaOrmEntity } from '../../registry/infrastructure/repositories/persona.orm-entity';
import { VehiculoOrmEntity } from '../../registry/infrastructure/repositories/vehiculo.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MiembroGrupoFamiliarOrmEntity,
      PermisoTemporalOrmEntity,
      PaseAccesoRapidoOrmEntity,
      UserOrmEntity,
      PersonaOrmEntity,
      VehiculoOrmEntity,
    ]),
    RegistryModule,
  ],
  controllers: [AuthorizationController],
  providers: [
    AuthorizationService,
    AuthorizationSeedService,
    {
      provide: MIEMBRO_GRUPO_FAMILIAR_REPOSITORY,
      useClass: TypeOrmMiembroGrupoFamiliarRepository,
    },
    {
      provide: PERMISO_TEMPORAL_REPOSITORY,
      useClass: TypeOrmPermisoTemporalRepository,
    },
    {
      provide: PASE_ACCESO_RAPIDO_REPOSITORY,
      useClass: TypeOrmPaseAccesoRapidoRepository,
    },
    {
      provide: ConstruccionConjuntoAutorizadoService,
      useFactory: (
        miembroGrupoFamiliarRepo: IMiembroGrupoFamiliarRepository,
        permisoRepo: IPermisoTemporalRepository,
      ) => new ConstruccionConjuntoAutorizadoService(miembroGrupoFamiliarRepo, permisoRepo),
      inject: [MIEMBRO_GRUPO_FAMILIAR_REPOSITORY, PERMISO_TEMPORAL_REPOSITORY],
    },
    {
      provide: EvaluacionPaseService,
      useFactory: (paseRepo: IPaseAccesoRapidoRepository) => new EvaluacionPaseService(paseRepo),
      inject: [PASE_ACCESO_RAPIDO_REPOSITORY],
    },
    {
      provide: AUTHORIZATION_CONTRACT,
      useClass: AuthorizationContractImpl,
    },
  ],
  exports: [AuthorizationService, AUTHORIZATION_CONTRACT],
})
export class AuthorizationModule {}
