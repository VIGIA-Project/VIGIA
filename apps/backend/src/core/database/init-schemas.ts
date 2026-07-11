import { Client } from 'pg';

export interface SchemaInitOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const REQUIRED_SCHEMAS = ['auth', 'registry', 'authorization', 'notification'];

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
    
    // Crear tabla notificaciones manualmente si no existe para evitar errores en dev
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification.notificaciones (
        notificacion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        titulo VARCHAR(150) NOT NULL,
        subtitulo TEXT NOT NULL,
        severidad VARCHAR(20) NOT NULL DEFAULT 'INFORMATIVA',
        destinatario_rol VARCHAR(50),
        destinatario_persona_id UUID,
        leida BOOLEAN NOT NULL DEFAULT FALSE,
        referencia_id UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } finally {
    await client.end();
  }
}
