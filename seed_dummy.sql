INSERT INTO alerting.alerts (id, alert_title, alert_description, alert_type, status, created_at, updated_at) VALUES
(gen_random_uuid(), 'Intento de Acceso Denegado', 'Vehiculo no registrado intento ingresar por puerta principal', 'error', 'ACTIVE', NOW() - INTERVAL '10 minutes', NOW()),
(gen_random_uuid(), 'Permiso Expirado', 'Se detecto vehiculo con permiso expirado en garaje norte', 'warning', 'ACTIVE', NOW() - INTERVAL '30 minutes', NOW()),
(gen_random_uuid(), 'Camara Desconectada', 'Perdida de senal de camara frontal LPR', 'error', 'ACTIVE', NOW() - INTERVAL '1 hour', NOW());

INSERT INTO access_control.access_events (id, license_plate, direction, decision, reason, created_at) VALUES
(gen_random_uuid(), 'PBW1234', 'ENTRADA', 'GRANTED', 'Autorizacion permanente valida', NOW() - INTERVAL '5 minutes'),
(gen_random_uuid(), 'XYZ9876', 'ENTRADA', 'DENIED', 'Vehiculo no registrado en el sistema', NOW() - INTERVAL '15 minutes'),
(gen_random_uuid(), 'ABC1122', 'SALIDA', 'GRANTED', 'Registro de salida automatico', NOW() - INTERVAL '45 minutes');
