import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricController } from './biometric.controller';
import { BiometricService, PERFIL_BIOMETRICO_REPOSITORY } from '../application/biometric.service';
import { PerfilBiometricoOrmEntity } from '../infrastructure/entities/perfil-biometrico.orm-entity';
import { TypeOrmPerfilBiometricoRepository } from '../infrastructure/repositories/typeorm-perfil-biometrico.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilBiometricoOrmEntity])],
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
