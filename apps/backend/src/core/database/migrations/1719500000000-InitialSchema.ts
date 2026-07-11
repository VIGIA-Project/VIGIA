import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1719500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ═══════════════════════════════════════════════════════════════
    // 1. EXTENSIONES
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "vector"`);

    // ═══════════════════════════════════════════════════════════════
    // 2. ESQUEMAS (5 dominio + 1 transversal)
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS registry`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "authorization"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS biometric`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS access_control`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS alerting`);

    // ═══════════════════════════════════════════════════════════════
    // 3. TIPOS ENUMERADOS
    // ═══════════════════════════════════════════════════════════════
    // Auth (transversal)
    await queryRunner.query(`CREATE TYPE auth.auth_role_enum AS ENUM ('ADMIN', 'GUARD', 'OWNER')`);
    await queryRunner.query(`CREATE TYPE auth.user_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_PASSWORD_CHANGE')`);
    // Registry
    await queryRunner.query(`CREATE TYPE registry.estado_registro_enum AS ENUM ('ACTIVO', 'INACTIVO')`);
    await queryRunner.query(`CREATE TYPE registry.identificacion_tipo_enum AS ENUM ('CEDULA', 'PASAPORTE', 'RUC')`);
    await queryRunner.query(`CREATE TYPE registry.rol_institucional_enum AS ENUM ('SUPER_ADMIN', 'ADMIN_OPERATIVO', 'GUARDIA')`);
    await queryRunner.query(`CREATE TYPE registry.estado_asignacion_enum AS ENUM ('ACTIVA', 'INACTIVA')`);
    // Authorization
    await queryRunner.query(`CREATE TYPE "authorization".estado_autorizacion_permanente_enum AS ENUM ('ACTIVA', 'INACTIVA')`);
    await queryRunner.query(`CREATE TYPE "authorization".estado_permiso_temporal_enum AS ENUM ('PROGRAMADO', 'ACTIVA', 'EXPIRADO', 'REVOCADO')`);
    await queryRunner.query(`CREATE TYPE "authorization".estado_pase_enum AS ENUM ('ACTIVO', 'CONSUMIDO', 'EXPIRADO', 'REVOCADO')`);
    await queryRunner.query(`CREATE TYPE "authorization".tipo_autorizacion_enum AS ENUM ('PERMANENTE', 'TEMPORAL')`);
    // Biometric
    await queryRunner.query(`CREATE TYPE biometric.estado_disponibilidad_biometrica_enum AS ENUM ('DISPONIBLE', 'NO_DISPONIBLE')`);
    await queryRunner.query(`CREATE TYPE biometric.tipo_captura_enum AS ENUM ('FRONTAL', 'IZQUIERDO', 'DERECHO')`);
    await queryRunner.query(`CREATE TYPE biometric.resultado_biometrico_enum AS ENUM ('COINCIDENCIA_SUFICIENTE', 'EVIDENCIA_INSUFICIENTE')`);
    // Access Control
    await queryRunner.query(`CREATE TYPE access_control.tipo_movimiento_enum AS ENUM ('ENTRADA', 'SALIDA')`);
    await queryRunner.query(`CREATE TYPE access_control.decision_operativa_enum AS ENUM ('SUCCESSFUL', 'PENDING_VERIFY', 'DENIED')`);
    await queryRunner.query(`CREATE TYPE access_control.origen_resolucion_enum AS ENUM ('AUTOMATICA', 'MANUAL', 'CONTINGENCIA', 'INVITADO')`);
    await queryRunner.query(`CREATE TYPE access_control.causa_contingencia_enum AS ENUM ('CAMARA_NO_DISPONIBLE', 'OCR_NO_DISPONIBLE', 'BIOMETRIA_NO_DISPONIBLE', 'CAIDA_RED', 'OPERACION_MANUAL')`);
    await queryRunner.query(`CREATE TYPE access_control.estado_invitado_enum AS ENUM ('REGISTRADO', 'VIGENTE', 'EXPIRADO', 'CERRADO')`);
    await queryRunner.query(`CREATE TYPE access_control.motivo_ingreso_enum AS ENUM ('VISITA_ACADEMICA', 'TRAMITE_ADMINISTRATIVO', 'ENTREGA_PROVEEDOR', 'EMERGENCIA', 'OTRO')`);
    // Alerting
    await queryRunner.query(`CREATE TYPE alerting.severidad_alerta_enum AS ENUM ('ALTA', 'MEDIA', 'INFORMATIVA')`);
    await queryRunner.query(`CREATE TYPE alerting.estado_atencion_alerta_enum AS ENUM ('GENERADA', 'ENTREGADA', 'ATENDIDA')`);
    await queryRunner.query(`CREATE TYPE alerting.canal_notificacion_enum AS ENUM ('DASHBOARD', 'TELEGRAM')`);
    await queryRunner.query(`CREATE TYPE alerting.estado_entrega_notificacion_enum AS ENUM ('PENDIENTE', 'ENVIADA', 'FALLIDA')`);

    // ═══════════════════════════════════════════════════════════════
    // 4. TABLAS
    // ═══════════════════════════════════════════════════════════════
    // --- auth.users ---
    await queryRunner.query(`
      CREATE TABLE auth.users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id UUID,
        email VARCHAR(160) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role auth.auth_role_enum NOT NULL,
        status auth.user_status_enum NOT NULL DEFAULT 'PENDING_PASSWORD_CHANGE',
        must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT uq_auth_users_email UNIQUE (email),
        CONSTRAINT ck_auth_users_email_institucional CHECK (lower(email) LIKE '%@uce.edu.ec'),
        CONSTRAINT ck_auth_users_persona_required CHECK (role = 'ADMIN' OR persona_id IS NOT NULL)
      )
    `);

    // --- registry.personas ---
    await queryRunner.query(`
      CREATE TABLE registry.personas (
        persona_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        identificacion_tipo registry.identificacion_tipo_enum NOT NULL,
        identificacion_numero VARCHAR(20) NOT NULL,
        nombres VARCHAR(120) NOT NULL,
        apellidos VARCHAR(120) NOT NULL,
        correo_institucional VARCHAR(160),
        telefono_contacto VARCHAR(30),
        estado_registro registry.estado_registro_enum NOT NULL DEFAULT 'ACTIVO',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT uq_personas_identificacion UNIQUE (identificacion_tipo, identificacion_numero)
      )
    `);

    // --- registry.asignaciones_rol ---
    await queryRunner.query(`
      CREATE TABLE registry.asignaciones_rol (
        asignacion_rol_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id UUID NOT NULL,
        rol_institucional registry.rol_institucional_enum NOT NULL,
        estado_asignacion registry.estado_asignacion_enum NOT NULL DEFAULT 'ACTIVA',
        vigente_desde TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        vigente_hasta TIMESTAMPTZ,
        CONSTRAINT fk_asignaciones_rol_persona FOREIGN KEY (persona_id) REFERENCES registry.personas(persona_id) ON DELETE CASCADE,
        CONSTRAINT ck_asignacion_rol_vigencia CHECK (vigente_hasta IS NULL OR vigente_hasta > vigente_desde)
      )
    `);

    // --- registry.vehiculos ---
    await queryRunner.query(`
      CREATE TABLE registry.vehiculos (
        vehiculo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        propietario_persona_id UUID NOT NULL,
        placa VARCHAR(10) NOT NULL,
        marca VARCHAR(60),
        modelo VARCHAR(60),
        color VARCHAR(40),
        anio SMALLINT,
        estado_registro registry.estado_registro_enum NOT NULL DEFAULT 'ACTIVO',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT uq_vehiculos_placa UNIQUE (placa),
        CONSTRAINT fk_vehiculos_propietario FOREIGN KEY (propietario_persona_id) REFERENCES registry.personas(persona_id)
      )
    `);

    // --- authorization.autorizaciones_permanentes ---
    await queryRunner.query(`
      CREATE TABLE "authorization".autorizaciones_permanentes (
        autorizacion_permanente_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehiculo_id UUID NOT NULL,
        persona_id UUID NOT NULL,
        otorgado_por_persona_id UUID NOT NULL,
        estado_autorizacion "authorization".estado_autorizacion_permanente_enum NOT NULL DEFAULT 'ACTIVA',
        tipo_autorizacion "authorization".tipo_autorizacion_enum NOT NULL DEFAULT 'PERMANENTE',
        motivo_estado TEXT,
        creada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        desactivada_en TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT ck_aut_perm_tipo CHECK (tipo_autorizacion = 'PERMANENTE'),
        CONSTRAINT ck_aut_perm_desactivada CHECK (desactivada_en IS NULL OR desactivada_en >= creada_en)
      )
    `);

    // --- authorization.permisos_temporales ---
    await queryRunner.query(`
      CREATE TABLE "authorization".permisos_temporales (
        permiso_temporal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehiculo_id UUID NOT NULL,
        persona_id UUID NOT NULL,
        otorgado_por_persona_id UUID NOT NULL,
        vigencia_inicio TIMESTAMPTZ NOT NULL,
        vigencia_fin TIMESTAMPTZ NOT NULL,
        estado_autorizacion "authorization".estado_permiso_temporal_enum NOT NULL DEFAULT 'PROGRAMADO',
        tipo_autorizacion "authorization".tipo_autorizacion_enum NOT NULL DEFAULT 'TEMPORAL',
        motivo_otorgamiento TEXT,
        revocado_en TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT ck_perm_temp_tipo CHECK (tipo_autorizacion = 'TEMPORAL'),
        CONSTRAINT ck_perm_temp_vigencia CHECK (vigencia_fin > vigencia_inicio),
        CONSTRAINT ck_perm_temp_revocado CHECK (revocado_en IS NULL OR revocado_en >= created_at)
      )
    `);

    // --- authorization.pases_acceso_rapido ---
    await queryRunner.query(`
      CREATE TABLE "authorization".pases_acceso_rapido (
        pase_acceso_rapido_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehiculo_id UUID NOT NULL,
        creado_por_persona_id UUID NOT NULL,
        nombre_conductor_externo VARCHAR(120) NOT NULL,
        cedula_conductor_externo VARCHAR(20) NOT NULL,
        placa VARCHAR(10) NOT NULL,
        motivo TEXT,
        codigo_acceso_hash VARCHAR(255) NOT NULL,
        vigencia_inicio TIMESTAMPTZ NOT NULL,
        vigencia_fin TIMESTAMPTZ NOT NULL,
        estado_pase "authorization".estado_pase_enum NOT NULL DEFAULT 'ACTIVO',
        consumido_en TIMESTAMPTZ,
        evento_consumo_id UUID,
        revocado_en TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT ck_pase_vigencia CHECK (vigencia_fin > vigencia_inicio),
        CONSTRAINT ck_pase_consumido CHECK (consumido_en IS NULL OR consumido_en >= vigencia_inicio),
        CONSTRAINT ck_pase_revocado CHECK (revocado_en IS NULL OR revocado_en >= created_at)
      )
    `);

    // --- biometric.perfiles_biometricos ---
    await queryRunner.query(`
      CREATE TABLE biometric.perfiles_biometricos (
        perfil_biometrico_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        persona_id UUID NOT NULL,
        estado_disponibilidad biometric.estado_disponibilidad_biometrica_enum NOT NULL DEFAULT 'DISPONIBLE',
        ultima_actualizacion_biometrica TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID
      )
    `);

    // --- biometric.representaciones_biometricas ---
    await queryRunner.query(`
      CREATE TABLE biometric.representaciones_biometricas (
        representacion_biometrica_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        perfil_biometrico_id UUID NOT NULL,
        tipo_captura biometric.tipo_captura_enum NOT NULL,
        embedding_vector vector(512) NOT NULL,
        calidad_captura NUMERIC(5,4),
        capturada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        activa BOOLEAN NOT NULL DEFAULT TRUE,
        CONSTRAINT fk_repr_perfil FOREIGN KEY (perfil_biometrico_id) REFERENCES biometric.perfiles_biometricos(perfil_biometrico_id) ON DELETE CASCADE,
        CONSTRAINT ck_repr_calidad CHECK (calidad_captura IS NULL OR (calidad_captura >= 0 AND calidad_captura <= 1))
      )
    `);

    // --- biometric.validaciones_biometricas ---
    await queryRunner.query(`
      CREATE TABLE biometric.validaciones_biometricas (
        validacion_biometrica_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id UUID NOT NULL,
        persona_detectada_id UUID,
        resultado_biometrico biometric.resultado_biometrico_enum NOT NULL,
        umbral_aplicado NUMERIC(5,4) NOT NULL,
        puntaje_mejor_coincidencia NUMERIC(5,4),
        cantidad_vectores_evaluados INTEGER NOT NULL,
        evaluada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        detalle_resultado TEXT,
        CONSTRAINT ck_validacion_umbral CHECK (umbral_aplicado >= 0 AND umbral_aplicado <= 1),
        CONSTRAINT ck_validacion_puntaje CHECK (puntaje_mejor_coincidencia IS NULL OR (puntaje_mejor_coincidencia >= 0 AND puntaje_mejor_coincidencia <= 1)),
        CONSTRAINT ck_validacion_vectores CHECK (cantidad_vectores_evaluados > 0)
      )
    `);

    // --- access_control.eventos_acceso ---
    await queryRunner.query(`
      CREATE TABLE access_control.eventos_acceso (
        evento_acceso_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehiculo_id UUID,
        persona_detectada_id UUID,
        placa_observada VARCHAR(10) NOT NULL,
        tipo_movimiento access_control.tipo_movimiento_enum NOT NULL,
        decision_operativa access_control.decision_operativa_enum NOT NULL,
        motivo_codigo VARCHAR(60) NOT NULL,
        motivo_detalle TEXT,
        origen_resolucion access_control.origen_resolucion_enum NOT NULL,
        validacion_biometrica_id UUID,
        evidencia_resumen TEXT,
        capturado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        resuelto_en TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID,
        updated_by UUID,
        CONSTRAINT ck_evento_resolucion_fecha CHECK (resuelto_en IS NULL OR resuelto_en >= capturado_en),
        CONSTRAINT ck_evento_successful_biometria CHECK (decision_operativa <> 'SUCCESSFUL' OR validacion_biometrica_id IS NULL OR persona_detectada_id IS NOT NULL),
        CONSTRAINT ck_evento_invitado_sin_biometria CHECK (origen_resolucion <> 'INVITADO' OR validacion_biometrica_id IS NULL)
      )
    `);

    // --- access_control.revisiones_humanas ---
    await queryRunner.query(`
      CREATE TABLE access_control.revisiones_humanas (
        revision_humana_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id UUID NOT NULL,
        actor_decisor_id UUID NOT NULL,
        decision_emitida access_control.decision_operativa_enum NOT NULL,
        motivo_revision TEXT NOT NULL,
        observaciones TEXT,
        revisado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_revision_evento FOREIGN KEY (evento_acceso_id) REFERENCES access_control.eventos_acceso(evento_acceso_id) ON DELETE CASCADE,
        CONSTRAINT uq_revision_evento UNIQUE (evento_acceso_id)
      )
    `);

    // --- access_control.registros_contingencia ---
    await queryRunner.query(`
      CREATE TABLE access_control.registros_contingencia (
        registro_contingencia_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id UUID NOT NULL,
        actor_responsable_id UUID NOT NULL,
        causa_contingencia access_control.causa_contingencia_enum NOT NULL,
        detalle_contingencia TEXT,
        registrado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_contingencia_evento FOREIGN KEY (evento_acceso_id) REFERENCES access_control.eventos_acceso(evento_acceso_id) ON DELETE CASCADE,
        CONSTRAINT uq_contingencia_evento UNIQUE (evento_acceso_id)
      )
    `);

    // --- access_control.registros_invitado ---
    await queryRunner.query(`
      CREATE TABLE access_control.registros_invitado (
        registro_invitado_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id UUID NOT NULL,
        placa_detectada VARCHAR(10) NOT NULL,
        nombre_invitado VARCHAR(120) NOT NULL,
        cedula_invitado VARCHAR(20) NOT NULL,
        facultad_destino VARCHAR(120) NOT NULL,
        carrera_destino VARCHAR(120),
        motivo_ingreso access_control.motivo_ingreso_enum NOT NULL,
        motivo_detalle TEXT,
        tiempo_permanencia_horas SMALLINT NOT NULL,
        estado_invitado access_control.estado_invitado_enum NOT NULL DEFAULT 'REGISTRADO',
        guardia_id UUID NOT NULL,
        registrado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expira_en TIMESTAMPTZ NOT NULL,
        cerrado_en TIMESTAMPTZ,
        CONSTRAINT fk_invitado_evento FOREIGN KEY (evento_acceso_id) REFERENCES access_control.eventos_acceso(evento_acceso_id) ON DELETE CASCADE,
        CONSTRAINT uq_invitado_evento UNIQUE (evento_acceso_id),
        CONSTRAINT ck_invitado_tiempo CHECK (tiempo_permanencia_horas IN (1, 2, 4, 6)),
        CONSTRAINT ck_invitado_expira CHECK (expira_en > registrado_en),
        CONSTRAINT ck_invitado_cerrado CHECK (cerrado_en IS NULL OR cerrado_en >= registrado_en)
      )
    `);

    // --- alerting.alertas ---
    await queryRunner.query(`
      CREATE TABLE alerting.alertas (
        alerta_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        causa_origen VARCHAR(80) NOT NULL,
        referencia_origen_id UUID NOT NULL,
        vehiculo_id UUID,
        severidad alerting.severidad_alerta_enum NOT NULL,
        estado_atencion alerting.estado_atencion_alerta_enum NOT NULL DEFAULT 'GENERADA',
        mensaje_resumen TEXT NOT NULL,
        generada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        atendida_en TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT ck_alerta_atencion_fecha CHECK (atendida_en IS NULL OR atendida_en >= generada_en)
      )
    `);

    // --- alerting.notificaciones ---
    await queryRunner.query(`
      CREATE TABLE alerting.notificaciones (
        notificacion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        alerta_id UUID NOT NULL,
        destinatario_persona_id UUID NOT NULL,
        canal alerting.canal_notificacion_enum NOT NULL,
        titulo VARCHAR(160) NOT NULL,
        estado_entrega alerting.estado_entrega_notificacion_enum NOT NULL DEFAULT 'PENDIENTE',
        contenido_resumen TEXT NOT NULL,
        leida BOOLEAN NOT NULL DEFAULT FALSE,
        leida_en TIMESTAMPTZ,
        enviada_en TIMESTAMPTZ,
        CONSTRAINT fk_notificacion_alerta FOREIGN KEY (alerta_id) REFERENCES alerting.alertas(alerta_id) ON DELETE CASCADE,
        CONSTRAINT ck_notificacion_lectura CHECK (leida_en IS NULL OR leida = TRUE)
      )
    `);

    // ═══════════════════════════════════════════════════════════════
    // 5. ÍNDICES
    // ═══════════════════════════════════════════════════════════════
    // Auth
    await queryRunner.query(`CREATE INDEX idx_auth_users_email ON auth.users (lower(email))`);
    await queryRunner.query(`CREATE INDEX idx_auth_users_persona ON auth.users (persona_id)`);
    await queryRunner.query(`CREATE INDEX idx_auth_users_role_status ON auth.users (role, status)`);

    // Registry
    await queryRunner.query(`CREATE INDEX idx_personas_identificacion ON registry.personas (identificacion_tipo, identificacion_numero)`);
    await queryRunner.query(`CREATE INDEX idx_personas_estado ON registry.personas (estado_registro)`);
    await queryRunner.query(`CREATE INDEX idx_asignaciones_rol_persona ON registry.asignaciones_rol (persona_id)`);
    await queryRunner.query(`CREATE INDEX idx_asignaciones_rol_rol_estado ON registry.asignaciones_rol (rol_institucional, estado_asignacion)`);
    await queryRunner.query(`CREATE INDEX idx_vehiculos_propietario ON registry.vehiculos (propietario_persona_id)`);
    await queryRunner.query(`CREATE INDEX idx_vehiculos_placa ON registry.vehiculos (placa)`);

    // Authorization
    await queryRunner.query(`CREATE UNIQUE INDEX uq_aut_perm_activa_vehiculo_persona ON "authorization".autorizaciones_permanentes (vehiculo_id, persona_id) WHERE estado_autorizacion = 'ACTIVA'`);
    await queryRunner.query(`CREATE INDEX idx_aut_perm_vehiculo_estado ON "authorization".autorizaciones_permanentes (vehiculo_id, estado_autorizacion)`);
    await queryRunner.query(`CREATE INDEX idx_aut_perm_persona_estado ON "authorization".autorizaciones_permanentes (persona_id, estado_autorizacion)`);
    await queryRunner.query(`CREATE INDEX idx_perm_temp_vehiculo_vigencia ON "authorization".permisos_temporales (vehiculo_id, vigencia_inicio, vigencia_fin)`);
    await queryRunner.query(`CREATE INDEX idx_perm_temp_persona_estado ON "authorization".permisos_temporales (persona_id, estado_autorizacion)`);
    await queryRunner.query(`CREATE INDEX idx_perm_temp_vigencia_fin ON "authorization".permisos_temporales (vigencia_fin)`);
    await queryRunner.query(`CREATE INDEX idx_pases_vehiculo_estado ON "authorization".pases_acceso_rapido (vehiculo_id, estado_pase)`);
    await queryRunner.query(`CREATE INDEX idx_pases_creador ON "authorization".pases_acceso_rapido (creado_por_persona_id)`);
    await queryRunner.query(`CREATE INDEX idx_pases_vigencia ON "authorization".pases_acceso_rapido (vigencia_inicio, vigencia_fin)`);
    await queryRunner.query(`CREATE INDEX idx_pases_codigo_hash ON "authorization".pases_acceso_rapido (codigo_acceso_hash)`);

    // Biometric
    await queryRunner.query(`CREATE UNIQUE INDEX uq_perfil_biometrico_persona_disponible ON biometric.perfiles_biometricos (persona_id) WHERE estado_disponibilidad = 'DISPONIBLE'`);
    await queryRunner.query(`CREATE INDEX idx_perfiles_persona_estado ON biometric.perfiles_biometricos (persona_id, estado_disponibilidad)`);
    await queryRunner.query(`CREATE INDEX idx_repr_perfil_activa ON biometric.representaciones_biometricas (perfil_biometrico_id, activa)`);
    await queryRunner.query(`CREATE UNIQUE INDEX uq_validacion_biometrica_evento ON biometric.validaciones_biometricas (evento_acceso_id)`);
    await queryRunner.query(`CREATE INDEX idx_validaciones_evento ON biometric.validaciones_biometricas (evento_acceso_id)`);
    await queryRunner.query(`CREATE INDEX idx_validaciones_persona_detectada ON biometric.validaciones_biometricas (persona_detectada_id)`);

    // Access Control
    await queryRunner.query(`CREATE INDEX idx_eventos_placa_capturado ON access_control.eventos_acceso (placa_observada, capturado_en DESC)`);
    await queryRunner.query(`CREATE INDEX idx_eventos_vehiculo_capturado ON access_control.eventos_acceso (vehiculo_id, capturado_en DESC)`);
    await queryRunner.query(`CREATE INDEX idx_eventos_persona_detectada ON access_control.eventos_acceso (persona_detectada_id)`);
    await queryRunner.query(`CREATE INDEX idx_eventos_decision ON access_control.eventos_acceso (decision_operativa)`);
    await queryRunner.query(`CREATE INDEX idx_eventos_pendientes ON access_control.eventos_acceso (capturado_en DESC) WHERE decision_operativa = 'PENDING_VERIFY'`);
    await queryRunner.query(`CREATE INDEX idx_revisiones_evento ON access_control.revisiones_humanas (evento_acceso_id)`);
    await queryRunner.query(`CREATE INDEX idx_contingencias_evento ON access_control.registros_contingencia (evento_acceso_id)`);
    await queryRunner.query(`CREATE INDEX idx_invitados_evento ON access_control.registros_invitado (evento_acceso_id)`);
    await queryRunner.query(`CREATE INDEX idx_invitados_estado ON access_control.registros_invitado (estado_invitado)`);
    await queryRunner.query(`CREATE INDEX idx_invitados_placa ON access_control.registros_invitado (placa_detectada)`);

    // Alerting
    await queryRunner.query(`CREATE INDEX idx_alertas_origen ON alerting.alertas (causa_origen, referencia_origen_id)`);
    await queryRunner.query(`CREATE INDEX idx_alertas_vehiculo ON alerting.alertas (vehiculo_id)`);
    await queryRunner.query(`CREATE INDEX idx_alertas_estado_severidad ON alerting.alertas (estado_atencion, severidad)`);
    await queryRunner.query(`CREATE INDEX idx_notificaciones_alerta ON alerting.notificaciones (alerta_id)`);
    await queryRunner.query(`CREATE INDEX idx_notificaciones_destinatario_estado ON alerting.notificaciones (destinatario_persona_id, estado_entrega)`);
    await queryRunner.query(`CREATE INDEX idx_notificaciones_destinatario_no_leidas ON alerting.notificaciones (destinatario_persona_id) WHERE leida = FALSE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Tablas (orden inverso por dependencias)
    await queryRunner.query(`DROP TABLE IF EXISTS alerting.notificaciones`);
    await queryRunner.query(`DROP TABLE IF EXISTS alerting.alertas`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.registros_invitado`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.registros_contingencia`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.revisiones_humanas`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.eventos_acceso`);
    await queryRunner.query(`DROP TABLE IF EXISTS biometric.validaciones_biometricas`);
    await queryRunner.query(`DROP TABLE IF EXISTS biometric.representaciones_biometricas`);
    await queryRunner.query(`DROP TABLE IF EXISTS biometric.perfiles_biometricos`);
    await queryRunner.query(`DROP TABLE IF EXISTS "authorization".pases_acceso_rapido`);
    await queryRunner.query(`DROP TABLE IF EXISTS "authorization".permisos_temporales`);
    await queryRunner.query(`DROP TABLE IF EXISTS "authorization".autorizaciones_permanentes`);
    await queryRunner.query(`DROP TABLE IF EXISTS registry.vehiculos`);
    await queryRunner.query(`DROP TABLE IF EXISTS registry.asignaciones_rol`);
    await queryRunner.query(`DROP TABLE IF EXISTS registry.personas`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.users`);

    // Enums
    await queryRunner.query(`DROP TYPE IF EXISTS alerting.estado_entrega_notificacion_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS alerting.canal_notificacion_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS alerting.estado_atencion_alerta_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS alerting.severidad_alerta_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.motivo_ingreso_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.estado_invitado_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.causa_contingencia_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.origen_resolucion_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.decision_operativa_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.tipo_movimiento_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS biometric.resultado_biometrico_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS biometric.tipo_captura_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS biometric.estado_disponibilidad_biometrica_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS "authorization".tipo_autorizacion_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS "authorization".estado_pase_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS "authorization".estado_permiso_temporal_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS "authorization".estado_autorizacion_permanente_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS registry.estado_asignacion_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS registry.rol_institucional_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS registry.identificacion_tipo_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS registry.estado_registro_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS auth.user_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS auth.auth_role_enum`);

    // Esquemas
    await queryRunner.query(`DROP SCHEMA IF EXISTS alerting CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS access_control CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS biometric CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "authorization" CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS registry CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS auth CASCADE`);

    // Extensiones
    await queryRunner.query(`DROP EXTENSION IF EXISTS "vector" CASCADE`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pgcrypto" CASCADE`);
  }
}
