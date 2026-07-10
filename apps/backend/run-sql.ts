import { AppDataSource } from './src/core/database/data-source';

AppDataSource.initialize().then(async () => {
  console.log("Running migration...");
  try {
    await AppDataSource.query(`ALTER TABLE registry.personas ADD COLUMN IF NOT EXISTS estado_biometrico VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'`);
    await AppDataSource.query(`ALTER TABLE registry.asignaciones_rol ADD COLUMN IF NOT EXISTS vehiculo_id UUID`);
    await AppDataSource.query(`ALTER TYPE registry.rol_institucional_enum ADD VALUE IF NOT EXISTS 'PROPIETARIO'`).catch(e => console.log('Enum value already exists'));
    await AppDataSource.query(`ALTER TYPE registry.rol_institucional_enum ADD VALUE IF NOT EXISTS 'FAMILIAR_AUTORIZADO'`).catch(e => console.log('Enum value already exists'));
    await AppDataSource.query(`ALTER TYPE registry.rol_institucional_enum ADD VALUE IF NOT EXISTS 'CONDUCTOR_PERMANENTE'`).catch(e => console.log('Enum value already exists'));
    await AppDataSource.query(`ALTER TYPE registry.rol_institucional_enum ADD VALUE IF NOT EXISTS 'PERSONA_AUTORIZADA'`).catch(e => console.log('Enum value already exists'));
    console.log("Migration done");
  } catch (err) {
    console.error("Migration error:", err);
  }
  process.exit(0);
}).catch(err => {
  console.error("Initialization error:", err);
  process.exit(1);
});
