import { Client } from 'pg';

export interface SchemaInitOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const REQUIRED_SCHEMAS = ['auth', 'registry', 'authorization', 'biometric', 'access_control', 'alerting'];

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
    
    // Extensión pgvector para embeddings
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    
    // Crear tabla raw para biometría si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS biometric.representaciones_biometricas (
        representacion_biometrica_id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY,
        perfil_biometrico_id uuid NOT NULL,
        tipo_captura varchar(50) NOT NULL,
        embedding_vector vector(512) NOT NULL,
        activa boolean DEFAULT true,
        created_at timestamp DEFAULT current_timestamp
      )
    `);
  } finally {
    await client.end();
  }
}
