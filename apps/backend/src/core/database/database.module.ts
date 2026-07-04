import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        schema: configService.get<string>('database.schema'),
        entities: [__dirname + '/../../**/*.{entity,orm-entity}{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: configService.get<boolean>('database.synchronize', false),
        logging: configService.get<boolean>('database.logging', false),
        ssl: configService.get<boolean>('database.ssl', false)
          ? { rejectUnauthorized: false }
          : false,
        extra: {
          max: configService.get<number>('database.maxConnections', 10),
        },
        migrationsRun: configService.get<boolean>(
          'database.migrationsRun',
          false,
        ),
        // pgvector extension support
        installExtensions: false,
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
