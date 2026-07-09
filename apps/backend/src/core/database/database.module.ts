import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { ensureSchemas } from './init-schemas';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('database.host');
        const port = configService.get<number>('database.port');
        const username = configService.get<string>('database.username');
        const password = configService.get<string>('database.password');
        const database = configService.get<string>('database.name');

        // Los schemas "auth" y "registry" deben existir antes de que
        // TypeORM sincronice las tablas (synchronize no crea schemas).
        await ensureSchemas({ host, port, username, password, database });

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          schema: configService.get<string>('database.schema'),
          autoLoadEntities: true,
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
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
