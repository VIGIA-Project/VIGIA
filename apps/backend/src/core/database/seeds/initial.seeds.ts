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

  // 6. Alertas in-app
  await dataSource.query(`
    INSERT INTO alerting.alertas
      (alerta_id, causa_origen, referencia_origen_id, vehiculo_id, severidad, estado_atencion, mensaje_resumen, generada_en)
    VALUES
      ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'ACCESO_DENEGADO', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ALTA', 'GENERADA', 'Intento de ingreso bloqueado: Vehículo PCH0001 sin tag RFID activo', NOW() - INTERVAL '15 minutes'),
      ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'PERMISO_EXPIRADO', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'MEDIA', 'GENERADA', 'Acceso denegado: Permiso temporal para vehículo PCH0001 expiró hace 2 días', NOW() - INTERVAL '2 hours'),
      ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3', 'BIOMETRIA_INCORRECTA', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ALTA', 'ATENDIDA', 'Fallo de verificación facial en Punto de Control Garita Norte', NOW() - INTERVAL '4 hours'),
      ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', 'ALERTA_SISTEMA', '00000000-0000-0000-0000-000000000003', NULL, 'INFORMATIVA', 'GENERADA', 'Servicio de sincronización con el padrón de la UCE restablecido con éxito', NOW() - INTERVAL '6 hours')
    ON CONFLICT (alerta_id) DO NOTHING
  `);

  // 7. Notificaciones in-app para el administrador (destinatario: admin@uce.edu.ec -> persona_id: '00000000-0000-0000-0000-000000000003')
  await dataSource.query(`
    INSERT INTO alerting.notificaciones
      (notificacion_id, alerta_id, destinatario_persona_id, canal, titulo, contenido_resumen, estado_entrega, leida, enviada_en)
    VALUES
      ('n1n1n1n1-n1n1-n1n1-n1n1-n1n1n1n1n1n1', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', '00000000-0000-0000-0000-000000000003', 'IN_APP', 'Alerta: Acceso Denegado', 'Intento de ingreso bloqueado: Vehículo PCH0001 sin tag RFID activo', 'ENTREGADA', false, NOW() - INTERVAL '15 minutes'),
      ('n2n2n2n2-n2n2-n2n2-n2n2-n2n2n2n2n2n2', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', '00000000-0000-0000-0000-000000000003', 'IN_APP', 'Alerta: Permiso Expirado', 'Acceso denegado: Permiso temporal para vehículo PCH0001 expiró hace 2 días', 'ENTREGADA', false, NOW() - INTERVAL '2 hours'),
      ('n4n4n4n4-n4n4-n4n4-n4n4-n4n4n4n4n4n4', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', '00000000-0000-0000-0000-000000000003', 'IN_APP', 'Notificación Informativa', 'Servicio de sincronización con el padrón de la UCE restablecido con éxito', 'ENTREGADA', false, NOW() - INTERVAL '6 hours')
    ON CONFLICT (notificacion_id) DO NOTHING
  `);

  // 8. Eventos de acceso hoy
  await dataSource.query(`
    INSERT INTO access_control.eventos_acceso
      (evento_acceso_id, vehiculo_id, persona_detectada_id, placa_observada, tipo_movimiento, decision_operativa, motivo_codigo, motivo_detalle, origen_resolucion, capturado_en, resuelto_en)
    VALUES
      ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'PCH0001', 'ENTRADA', 'SUCCESSFUL', 'AUTORIZADO_PERMANENTE', 'Acceso autorizado por grupo familiar del dueño del vehículo', 'AUTOMATICA', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '10 minutes'),
      ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'PCH0001', 'SALIDA', 'SUCCESSFUL', 'SALIDA_REGISTRADA', 'Salida normal registrada', 'AUTOMATICA', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
      ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'PCH0001', 'ENTRADA', 'PENDING_VERIFY', 'VERIFICACION_MANUAL', 'Placa detectada pero biometría del conductor requiere verificación de guardia', 'MANUAL', NOW() - INTERVAL '2 hours', NULL),
      ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', NULL, NULL, 'XYZ9999', 'ENTRADA', 'DENIED', 'SIN_AUTORIZACION', 'Vehículo no registrado en el padrón institucional ni con invitación activa', 'AUTOMATICA', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
      ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d5d5', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'PCH0001', 'ENTRADA', 'SUCCESSFUL', 'AUTORIZADO_PERMANENTE', 'Acceso autorizado por grupo familiar del dueño del vehículo', 'AUTOMATICA', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours')
    ON CONFLICT (evento_acceso_id) DO NOTHING
  `);

  console.log('✅ Seeds completados.');
  console.log('   Placa de prueba: PCH0001');
  console.log('   Admin: admin@uce.edu.ec / password (cambio obligatorio)');
}
