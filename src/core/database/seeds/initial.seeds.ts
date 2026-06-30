import { DataSource } from 'typeorm';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Ejecutando seeds iniciales...');

  // Personas de prueba
  await dataSource.query(`
    INSERT INTO registry.persons
      (first_name, last_name, email, document_id, document_type, role, status)
    VALUES
      ('Usuario',  'Prueba1', 'prueba1@test.vigia', '1700000001', 'CEDULA', 'OWNER',    'ACTIVE'),
      ('Usuario',  'Prueba2', 'prueba2@test.vigia', '1700000002', 'CEDULA', 'OWNER',    'ACTIVE'),
      ('Admin',    'Sistema', 'admin@test.vigia',   '1700000003', 'CEDULA', 'ADMIN',    'ACTIVE')
    ON CONFLICT (document_id) DO NOTHING
  `);

  // Vehículos de prueba
  await dataSource.query(`
    INSERT INTO registry.vehicles
      (plate_number, make, model, year, color, status)
    VALUES
      ('TST0001', 'Toyota', 'Corolla', 2020, 'Blanco', 'ACTIVE'),
      ('TST0002', 'Yamaha', 'FZ',      2021, 'Negro',  'ACTIVE')
    ON CONFLICT (plate_number) DO NOTHING
  `);

  // Alerta de sistema
  await dataSource.query(`
    INSERT INTO alerting.alerts
      (type, severity, title, description, source, status)
    VALUES (
      'SYSTEM', 'LOW',
      'Sistema inicializado',
      'VIGIA inicializado correctamente con datos de prueba.',
      'system', 'OPEN'
    )
    ON CONFLICT DO NOTHING
  `);

  console.log('🎉 Seeds completados. Placas de prueba: TST0001, TST0002');
}