import { DataSource } from 'typeorm';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  console.log('🌱 Ejecutando seeds iniciales...');

  // 1. Persona de prueba (propietario)
  await dataSource.query(`
    INSERT INTO registry.personas
      (persona_id, identificacion_tipo, identificacion_numero, nombres, apellidos, correo_institucional, estado_registro)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'CEDULA', '1700000001', 'Carlos', 'Mendoza', 'cmendoza@uce.edu.ec', 'ACTIVO'),
      ('00000000-0000-0000-0000-000000000002', 'CEDULA', '1700000002', 'María', 'López', 'mlopez@uce.edu.ec', 'ACTIVO'),
      ('00000000-0000-0000-0000-000000000003', 'CEDULA', '1700000003', 'Admin', 'Sistema', 'admin@uce.edu.ec', 'ACTIVO')
    ON CONFLICT (identificacion_tipo, identificacion_numero) DO NOTHING
  `);

  // 2. Asignaciones de rol
  await dataSource.query(`
    INSERT INTO registry.asignaciones_rol
      (asignacion_rol_id, persona_id, rol_institucional, estado_asignacion)
    VALUES
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000003', 'ADMIN_OPERATIVO', 'ACTIVA'),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000002', 'GUARDIA', 'ACTIVA')
    ON CONFLICT (asignacion_rol_id) DO NOTHING
  `);

  // 3. Vehículo de prueba
  await dataSource.query(`
    INSERT INTO registry.vehiculos
      (vehiculo_id, propietario_persona_id, placa, marca, modelo, color, anio, estado_registro)
    VALUES
      ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'PCH0001', 'Toyota', 'Corolla', 'Blanco', 2020, 'ACTIVO')
    ON CONFLICT (placa) DO NOTHING
  `);

  // 4. Autorización permanente
  await dataSource.query(`
    INSERT INTO "authorization".autorizaciones_permanentes
      (autorizacion_permanente_id, vehiculo_id, persona_id, otorgado_por_persona_id, estado_autorizacion, tipo_autorizacion)
    VALUES
      ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'ACTIVA', 'PERMANENTE')
    ON CONFLICT (autorizacion_permanente_id) DO NOTHING
  `);

  // 5. Usuario administrador (contraseña: "password" — solo para desarrollo)
  await dataSource.query(`
    INSERT INTO auth.users
      (user_id, persona_id, email, password_hash, role, status, must_change_password)
    VALUES
      ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000003', 'admin@uce.edu.ec', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', 'PENDING_PASSWORD_CHANGE', true)
    ON CONFLICT (email) DO NOTHING
  `);

  console.log('✅ Seeds completados.');
  console.log('   Placa de prueba: PCH0001');
  console.log('   Admin: admin@uce.edu.ec / password (cambio obligatorio)');
}