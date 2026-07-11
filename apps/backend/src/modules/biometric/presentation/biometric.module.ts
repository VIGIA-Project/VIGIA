import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistryModule } from '../../registry/presentation/registry.module';
import { BiometricController } from './biometric.controller';
import { BiometricService } from '../application/biometric.service';
import { TypeOrmPerfilBiometricoRepository } from '../infrastructure/repositories/typeorm-perfil-biometrico.repository';
import { PerfilBiometricoOrmEntity } from '../infrastructure/entities/perfil-biometrico.orm-entity';
import { PERFIL_BIOMETRICO_REPOSITORY } from '@shared/constants/injection-tokens';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilBiometricoOrmEntity]), RegistryModule],
  controllers: [BiometricController],
  providers: [
    BiometricService,
    {
      provide: PERFIL_BIOMETRICO_REPOSITORY,
      useClass: TypeOrmPerfilBiometricoRepository,
    },
  ],
  exports: [BiometricService],
})
export class BiometricModule {}
