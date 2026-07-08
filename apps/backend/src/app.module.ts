import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database/database.module';
import { LoggerModule } from '@shared/logger/logger.module';
import * as path from 'path';
import { HealthModule } from './presentation/health/health.module';
import { AccessControlModule } from '@modules/access-control/presentation/access-control.module';
import { AuthorizationModule } from '@modules/authorization/presentation/authorization.module';
import { RegistryModule } from '@modules/registry/presentation/registry.module';
import { BiometricModule } from '@modules/biometric/presentation/biometric.module';
import { AlertingModule } from '@modules/alerting/presentation/alerting.module';
import { AuthModule } from '@core/auth/auth.module';
import appConfig from '@core/config/app.config';
import databaseConfig from '@core/config/database.config';
import { envValidationSchema } from '@core/config/env.validation';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
      envFilePath: [
        path.resolve(__dirname, '../../.env'),
        path.resolve(__dirname, '../../.env.local'),
        path.resolve(__dirname, '../../../.env'),
        path.resolve(__dirname, '../../../.env.local'),
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../.env'),
        path.resolve(process.cwd(), '../../.env'),
      ],
      cache: true,
      expandVariables: true,
    }),

    // Infraestructura compartida
    LoggerModule,
    DatabaseModule,
    AuthModule,

    // Health check
    HealthModule,

    // Bounded Contexts - Módulos de negocio
    AccessControlModule,
    AuthorizationModule,
    RegistryModule,
    BiometricModule,
    AlertingModule,
  ],
})
export class AppModule {}
