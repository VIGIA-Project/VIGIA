import { DataSource } from 'typeorm';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Ejecutando seeds iniciales (Limpieza aplicada)...');

  // 1. Personas base
  await dataSource.query(`
    INSERT INTO registry.personas
      (persona_id, identificacion_tipo, identificacion_numero, nombres, apellidos, correo_institucional, estado_registro)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'CEDULA', '0000000001', 'Admin', 'Sistema', 'admin@uce.edu.ec', 'ACTIVO'),
      ('00000000-0000-0000-0000-000000000002', 'CEDULA', '0000000002', 'Guardia', 'Principal', 'guardia@uce.edu.ec', 'ACTIVO'),
      ('00000000-0000-0000-0000-000000000003', 'CEDULA', '0000000003', 'Propietario', 'Uno', 'propietario@uce.edu.ec', 'ACTIVO'),
      ('00000000-0000-0000-0000-000000000004', 'CEDULA', '0000000004', 'Propietario', 'Dos', 'propietario2@uce.edu.ec', 'ACTIVO')
    ON CONFLICT (persona_id) DO NOTHING
  `);

  // 2. Usuarios del sistema
  await dataSource.query(`
    INSERT INTO auth.users
      (user_id, persona_id, email, password_hash, role, status, must_change_password)
    VALUES
      ('11111111-1111-1111-1111-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@uce.edu.ec', '$2b$10$nTKhEFGsUPM2kOSIztb7zO3KIi8zxgAKp2sUxuc43/9SGu96c.Am.', 'ADMIN', 'ACTIVE', false),
      ('22222222-2222-2222-2222-000000000002', '00000000-0000-0000-0000-000000000002', 'guardia@uce.edu.ec', '$2b$10$IHpI07Xv6nPenXTmeqZ7G.ld2gMi9S0jDGxX.VHsrstXpxq8YeZmG', 'GUARD', 'ACTIVE', false),
      ('33333333-3333-3333-3333-000000000003', '00000000-0000-0000-0000-000000000003', 'propietario@uce.edu.ec', '$2b$10$EwTreHRS7yj/Lb0/dF49zuaWoXnv.dh/RCrB/hB/RXOffHLxN39Qi', 'OWNER', 'ACTIVE', false),
      ('44444444-4444-4444-4444-000000000004', '00000000-0000-0000-0000-000000000004', 'propietario2@uce.edu.ec', '$2b$10$EwTreHRS7yj/Lb0/dF49zuaWoXnv.dh/RCrB/hB/RXOffHLxN39Qi', 'OWNER', 'ACTIVE', false)
    ON CONFLICT (user_id) DO NOTHING
  `);

  console.log('✅ Seeds completados (Entorno limpio).');
}
