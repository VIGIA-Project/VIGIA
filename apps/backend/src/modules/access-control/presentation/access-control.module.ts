import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from '../application/access-control.service';
import { TypeOrmEventoAccesoRepository } from '../infrastructure/repositories/typeorm-evento-acceso.repository';
import { EventoAccesoOrmEntity } from '../infrastructure/entities/evento-acceso.orm-entity';
import { EVENTO_ACCESO_REPOSITORY, OCR_PROVIDER } from '@shared/constants/injection-tokens';
import { AuthorizationModule } from '../../authorization/presentation/authorization.module';
import { AlertingModule } from '../../alerting/presentation/alerting.module';
import { IntegrationsController } from './integrations.controller';
import { StubOcrProvider } from '../infrastructure/adapters/stub-ocr.provider';
import { HttpOcrProvider } from '../infrastructure/adapters/http-ocr.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventoAccesoOrmEntity]),
    ConfigModule,
    AuthorizationModule,
    AlertingModule,
  ],
  controllers: [AccessControlController, IntegrationsController],
  providers: [
    AccessControlService,
    StubOcrProvider,
    HttpOcrProvider,
    {
      provide: EVENTO_ACCESO_REPOSITORY,
      useClass: TypeOrmEventoAccesoRepository,
    },
    {
      provide: OCR_PROVIDER,
      useFactory: (configService: ConfigService, stub: StubOcrProvider, http: HttpOcrProvider) => {
        const useStubs = configService.get<string>('USE_AI_STUBS', 'true') !== 'false';
        return useStubs ? stub : http;
      },
      inject: [ConfigService, StubOcrProvider, HttpOcrProvider],
    },
  ],
  exports: [AccessControlService, OCR_PROVIDER],
})
export class AccessControlModule {}
