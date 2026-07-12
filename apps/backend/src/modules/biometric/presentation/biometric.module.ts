import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistryModule } from '../../registry/presentation/registry.module';
import { BiometricController } from './biometric.controller';
import { BiometricService } from '../application/biometric.service';
import { TypeOrmPerfilBiometricoRepository } from '../infrastructure/repositories/typeorm-perfil-biometrico.repository';
import { PerfilBiometricoOrmEntity } from '../infrastructure/entities/perfil-biometrico.orm-entity';
import { PERFIL_BIOMETRICO_REPOSITORY, BIOMETRIC_PROVIDER } from '@shared/constants/injection-tokens';
import { StubBiometricProvider } from '../infrastructure/adapters/stub-biometric.provider';
import { HttpBiometricProvider } from '../infrastructure/adapters/http-biometric.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerfilBiometricoOrmEntity]),
    ConfigModule,
    RegistryModule,
  ],
  controllers: [BiometricController],
  providers: [
    BiometricService,
    StubBiometricProvider,
    HttpBiometricProvider,
    {
      provide: PERFIL_BIOMETRICO_REPOSITORY,
      useClass: TypeOrmPerfilBiometricoRepository,
    },
    {
      provide: BIOMETRIC_PROVIDER,
      useFactory: (configService: ConfigService, stub: StubBiometricProvider, http: HttpBiometricProvider) => {
        const useStubs = configService.get<string>('USE_AI_STUBS', 'true') !== 'false';
        return useStubs ? stub : http;
      },
      inject: [ConfigService, StubBiometricProvider, HttpBiometricProvider],
    },
  ],
  exports: [BiometricService, BIOMETRIC_PROVIDER],
})
export class BiometricModule {}
