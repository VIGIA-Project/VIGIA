import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';

const envPaths = [
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '../../.env'),
];
for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'vigia_db',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
});