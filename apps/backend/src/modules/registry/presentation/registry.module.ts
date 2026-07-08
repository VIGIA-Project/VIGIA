import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaController } from './persona.controller';
import { VehiculoController } from './vehiculo.controller';
import { AsignacionRolController } from './asignacion-rol.controller';
import { PersonaUseCases } from '../application/use-cases/persona.use-cases';
import { VehiculoUseCases } from '../application/use-cases/vehiculo.use-cases';
import { AsignacionRolUseCases } from '../application/use-cases/asignacion-rol.use-cases';
import { RegistryPortImpl } from '../application/ports/registry.port.impl';
import { PersonaRepositoryImpl } from '../infrastructure/repositories/persona.repository.impl';
import { VehiculoRepositoryImpl } from '../infrastructure/repositories/vehiculo.repository.impl';
import { AsignacionRolRepositoryImpl } from '../infrastructure/repositories/asignacion-rol.repository.impl';
import { PersonaOrmEntity } from '../infrastructure/repositories/persona.orm-entity';
import { VehiculoOrmEntity } from '../infrastructure/repositories/vehiculo.orm-entity';
import { AsignacionRolOrmEntity } from '../infrastructure/repositories/asignacion-rol.orm-entity';
import { PERSONA_REPOSITORY } from '../domain/repositories/persona.repository';
import { VEHICULO_REPOSITORY } from '../domain/repositories/vehiculo.repository';
import { ASIGNACION_ROL_REPOSITORY } from '../domain/repositories/asignacion-rol.repository';
import { REGISTRY_PORT } from '../application/ports/registry.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonaOrmEntity,
      VehiculoOrmEntity,
      AsignacionRolOrmEntity,
    ]),
  ],
  controllers: [
    PersonaController,
    VehiculoController,
    AsignacionRolController,
  ],
  providers: [
    PersonaUseCases,
    VehiculoUseCases,
    AsignacionRolUseCases,
    {
      provide: PERSONA_REPOSITORY,
      useClass: PersonaRepositoryImpl,
    },
    {
      provide: VEHICULO_REPOSITORY,
      useClass: VehiculoRepositoryImpl,
    },
    {
      provide: ASIGNACION_ROL_REPOSITORY,
      useClass: AsignacionRolRepositoryImpl,
    },
    {
      provide: REGISTRY_PORT,
      useClass: RegistryPortImpl,
    },
  ],
  exports: [REGISTRY_PORT, PersonaUseCases, VehiculoUseCases],
})
export class RegistryModule {}