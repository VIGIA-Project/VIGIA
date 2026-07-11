import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccessControlSchema1720000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ── ENUMS ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.tipo_movimiento_enum AS ENUM ('ENTRADA', 'SALIDA');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.decision_operativa_enum AS ENUM (
          'SUCCESSFUL', 'PENDING_VERIFY', 'DENIED'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.origen_resolucion_enum AS ENUM (
          'AUTOMATICA', 'MANUAL', 'CONTINGENCIA', 'INVITADO', 'PASE_RAPIDO'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.causa_contingencia_enum AS ENUM (
          'BIOMETRIA_NO_DISPONIBLE', 'CAMARA_NO_DISPONIBLE',
          'OCR_NO_DISPONIBLE', 'CAIDA_RED', 'OPERACION_MANUAL'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.motivo_invitado_enum AS ENUM (
          'VISITA_ACADEMICA', 'TRAMITE_ADMINISTRATIVO',
          'ENTREGA_PROVEEDOR', 'EMERGENCIA', 'OTRO'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE access_control.estado_invitado_enum AS ENUM (
          'REGISTRADO', 'VIGENTE', 'EXPIRADO', 'CERRADO'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // ── TABLA PRINCIPAL: eventos_acceso ───────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.eventos_acceso (
        evento_acceso_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehiculo_id             UUID,
        persona_detectada_id    UUID,
        placa_observada         VARCHAR(15) NOT NULL,
        tipo_movimiento         access_control.tipo_movimiento_enum NOT NULL,
        decision_operativa      access_control.decision_operativa_enum NOT NULL DEFAULT 'PENDING_VERIFY',
        motivo_codigo           VARCHAR(80),
        motivo_detalle          TEXT,
        origen_resolucion       access_control.origen_resolucion_enum,
        punto_control_id        UUID,
        carril                  VARCHAR(20),
        score_biometrico        NUMERIC(5,4),
        umbral_aplicado         NUMERIC(5,4) DEFAULT 0.75,
        evidencia_resumen       TEXT,
        capturado_en            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        resuelto_en             TIMESTAMPTZ,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── REVISIONES HUMANAS ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.revisiones_humanas (
        revision_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id        UUID NOT NULL UNIQUE
          REFERENCES access_control.eventos_acceso(evento_acceso_id),
        actor_decisor_id        UUID NOT NULL,
        decision_emitida        access_control.decision_operativa_enum NOT NULL,
        motivo_revision         TEXT NOT NULL,
        chip_motivo_sugerido    VARCHAR(120),
        observaciones           TEXT,
        revisado_en             TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── CONTINGENCIAS ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.registros_contingencia (
        contingencia_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id        UUID NOT NULL UNIQUE
          REFERENCES access_control.eventos_acceso(evento_acceso_id),
        actor_responsable_id    UUID NOT NULL,
        causa_contingencia      access_control.causa_contingencia_enum NOT NULL,
        decision_tomada         access_control.decision_operativa_enum NOT NULL,
        detalle_contingencia    TEXT NOT NULL,
        registrado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── REGISTROS INVITADO ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.registros_invitado (
        invitado_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evento_acceso_id        UUID NOT NULL UNIQUE
          REFERENCES access_control.eventos_acceso(evento_acceso_id),
        placa_detectada         VARCHAR(15) NOT NULL,
        nombre_invitado         VARCHAR(160) NOT NULL,
        cedula_invitado         VARCHAR(20) NOT NULL,
        facultad_destino        VARCHAR(120),
        carrera_destino         VARCHAR(120),
        motivo_ingreso          access_control.motivo_invitado_enum NOT NULL,
        detalle_motivo          TEXT,
        tiempo_permanencia_horas SMALLINT NOT NULL
          CHECK (tiempo_permanencia_horas IN (1, 2, 4, 6)),
        estado_invitado         access_control.estado_invitado_enum NOT NULL DEFAULT 'REGISTRADO',
        guardia_id              UUID NOT NULL,
        registrado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expira_en               TIMESTAMPTZ NOT NULL,
        cerrado_en              TIMESTAMPTZ
      );
    `);

    // ── ÍNDICES ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_eventos_pending
        ON access_control.eventos_acceso (capturado_en DESC)
        WHERE decision_operativa = 'PENDING_VERIFY';
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_eventos_placa
        ON access_control.eventos_acceso (placa_observada, capturado_en DESC);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_invitados_estado
        ON access_control.registros_invitado (estado_invitado, expira_en);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.registros_invitado CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.registros_contingencia CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.revisiones_humanas CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS access_control.eventos_acceso CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.estado_invitado_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.motivo_invitado_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.causa_contingencia_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.origen_resolucion_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.decision_operativa_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS access_control.tipo_movimiento_enum;`);
  }
}
