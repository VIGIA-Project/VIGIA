import { Client } from 'pg';

export interface SchemaInitOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const REQUIRED_SCHEMAS = ['auth', 'registry', 'authorization', 'access_control', 'alerting'];

export async function ensureSchemas(options: SchemaInitOptions): Promise<void> {
  const client = new Client({
    host: options.host,
    port: options.port,
    user: options.username,
    password: options.password,
    database: options.database,
  });

  await client.connect();
  try {
    for (const schema of REQUIRED_SCHEMAS) {
      await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    }
    // Requerido por @PrimaryGeneratedColumn('uuid') (usa uuid_generate_v4()).
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  } finally {
    await client.end();
  }
}
