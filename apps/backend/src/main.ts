import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { AllExceptionsFilter } from '@core/exceptions/exceptions.filter';
import { VigiaLogger } from '@shared/logger/logger.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(VigiaLogger);

  // Logger global
  app.useLogger(logger);

  // Prefijo global de API
  const apiPrefix = configService.get<string>('APP_API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['health', 'health/liveness', 'health/readiness'],
  });

  // Versionado (opcional, preparado para futuro)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Interceptores globales
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
  );

  // Filtro de excepciones global
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  const port = configService.get<number>('APP_PORT', 3000);
  await app.listen(port);

  logger.log(
    `🚨 VIGIA arrancado en: http://localhost:${port}/${apiPrefix}`,
    'Bootstrap',
  );
  logger.log(
    `🏥 Health check en: http://localhost:${port}/health`,
    'Bootstrap',
  );
}

bootstrap();
