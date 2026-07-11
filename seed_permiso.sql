INSERT INTO "authorization".permisos_temporales (id, persona_id, vehiculo_id, propietario_id, tipo, estado, vigencia_inicio, vigencia_fin, motivo, created_at, updated_at) VALUES
(gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 'TEMPORAL', 'ACTIVA', NOW(), NOW() + INTERVAL '1 day', 'Permiso inyectado de prueba', NOW(), NOW());
