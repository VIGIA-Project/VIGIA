import { DataSource } from 'typeorm';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Ejecutando seeds iniciales...');

  // Personas de prueba
  await dataSource.query(`
    INSERT INTO registry.persons
      (id, first_name, last_name, email, document_number, document_type, role, is_active)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'Usuario',  'Prueba1', 'prueba1@test.vigia', '1700000001', 'CEDULA', 'DOCENTE', true),
      ('00000000-0000-0000-0000-000000000002', 'Usuario',  'Prueba2', 'prueba2@test.vigia', '1700000002', 'CEDULA', 'ESTUDIANTE', true),
      ('00000000-0000-0000-0000-000000000003', 'Admin',    'Sistema', 'admin@test.vigia',   '1700000003', 'CEDULA', 'ADMINISTRATIVO', true)
    ON CONFLICT (document_number) DO NOTHING
  `);

  // Vehículos de prueba
  await dataSource.query(`
    INSERT INTO registry.vehicles
      (id, license_plate, type, brand, model, year, color, owner_id, is_active)
    VALUES
      ('11111111-1111-1111-1111-111111111111', 'TST0001', 'CAR', 'Toyota', 'Corolla', 2020, 'Blanco', '00000000-0000-0000-0000-000000000001', true),
      ('22222222-2222-2222-2222-222222222222', 'TST0002', 'MOTORCYCLE', 'Yamaha', 'FZ', 2021, 'Negro', '00000000-0000-0000-0000-000000000002', true)
    ON CONFLICT (license_plate) DO NOTHING
  `);

  // Autorización de prueba (permanente)
  await dataSource.query(`
    INSERT INTO "authorization".authorizations
      (id, person_id, vehicle_id, authorization_type, status, valid_from, access_point_id)
    VALUES
      ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'PERMANENT', 'ACTIVE', NOW(), '00000000-0000-0000-0000-000000000000')
    ON CONFLICT (id) DO NOTHING
  `);

  // Alerta de sistema
  await dataSource.query(`
    INSERT INTO alerting.alerts
      (id, type, severity, title, description, source, status)
    VALUES (
      '44444444-4444-4444-4444-444444444444', 'SYSTEM', 'LOW',
      'Sistema inicializado',
      'VIGIA inicializado correctamente con datos de prueba.',
      'system', 'OPEN'
    )
    ON CONFLICT (id) DO NOTHING
  `);

  console.log('🎉 Seeds completados. Placas de prueba: TST0001, TST0002');
}