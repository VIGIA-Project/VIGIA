import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'vigia_db',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
});