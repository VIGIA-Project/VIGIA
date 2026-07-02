import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'vigia_user',
  password: process.env.DB_PASSWORD ?? 'vigia_secret',
  name: process.env.DB_NAME ?? 'vigia_db',
  schema: process.env.DB_SCHEMA ?? 'public',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS ?? '10', 10),
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
}));
