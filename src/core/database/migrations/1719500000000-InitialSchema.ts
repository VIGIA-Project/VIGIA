import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1720800000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. pgvector y uuid-ossp
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // 2. Esquemas
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS access_control`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "authorization"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS registry`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS biometric`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS alerting`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);

        // 3. Enum types de dominio
        // Registry
        await queryRunner.query(`CREATE TYPE registry.person_type_enum AS ENUM ('OWNER', 'FAMILY_MEMBER', 'TEMPORARY_GUEST')`);
        await queryRunner.query(`CREATE TYPE registry.vehicle_type_enum AS ENUM ('CAR', 'MOTORCYCLE', 'TRUCK', 'VAN', 'BUS', 'BICYCLE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE registry.vehicle_status_enum AS ENUM ('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TYPE registry.institutional_role_enum AS ENUM ('DOCENTE', 'ADMINISTRATIVO', 'ESTUDIANTE', 'TRABAJADOR')`);
        // Authorization
        await queryRunner.query(`CREATE TYPE "authorization".authorization_type_enum AS ENUM ('PERMANENT', 'TEMPORARY')`);
        await queryRunner.query(`CREATE TYPE "authorization".authorization_status_enum AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TYPE "authorization".quick_pass_status_enum AS ENUM ('ACTIVE', 'CONSUMED', 'EXPIRED', 'REVOKED')`);
        // Access Control
        await queryRunner.query(`CREATE TYPE access_control.decision_enum AS ENUM ('SUCCESSFUL', 'PENDING_VERIFY', 'DENIED')`);
        await queryRunner.query(`CREATE TYPE access_control.access_method_enum AS ENUM ('BIOMETRIC', 'QUICK_PASS', 'MANUAL_OVERRIDE')`);
        // Biometric
        await queryRunner.query(`CREATE TYPE biometric.embedding_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED')`);
        // Alerting
        await queryRunner.query(`CREATE TYPE alerting.alert_severity_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`CREATE TYPE alerting.notification_status_enum AS ENUM ('UNREAD', 'READ', 'DISMISSED')`);
        // Auth (transversal)
        await queryRunner.query(`CREATE TYPE auth.auth_role_enum AS ENUM ('ADMIN', 'GUARD', 'OWNER')`);
        await queryRunner.query(`CREATE TYPE auth.user_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_PASSWORD_CHANGE')`);

        // 4. Función de auditoría
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

        // 5. registry.persons
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.persons (
        id            UUID DEFAULT gen_random_uuid(),
        first_name    VARCHAR(50)  NOT NULL,
        last_name     VARCHAR(50)  NOT NULL,
        email         VARCHAR(100) NOT NULL,
        phone         VARCHAR(20),
        document_number VARCHAR(20)  NOT NULL,
        document_type VARCHAR(20)  NOT NULL,
        role          registry.institutional_role_enum NOT NULL,
        is_active     BOOLEAN NOT NULL DEFAULT true,
        created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by    VARCHAR(100),
        updated_by    VARCHAR(100),
        CONSTRAINT pk_persons PRIMARY KEY (id),
        CONSTRAINT uq_persons_email UNIQUE (email),
        CONSTRAINT uq_persons_document_number UNIQUE (document_number)
      )
    `);

        // 6. registry.vehicles
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.vehicles (
        id           UUID DEFAULT gen_random_uuid(),
        license_plate VARCHAR(20) NOT NULL,
        type         registry.vehicle_type_enum NOT NULL,
        brand        VARCHAR(50) NOT NULL,
        model        VARCHAR(50) NOT NULL,
        year         INTEGER     NOT NULL,
        color        VARCHAR(30) NOT NULL,
        owner_id     UUID,
        is_active    BOOLEAN NOT NULL DEFAULT true,
        registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by   VARCHAR(100),
        updated_by   VARCHAR(100),
        CONSTRAINT pk_vehicles PRIMARY KEY (id),
        CONSTRAINT uq_vehicles_license_plate UNIQUE (license_plate)
      )
    `);

        // 7. registry.ownerships
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.ownerships (
        id             UUID DEFAULT gen_random_uuid(),
        person_id      UUID        NOT NULL,
        vehicle_id     UUID        NOT NULL,
        ownership_type VARCHAR(30) NOT NULL,
        start_date     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        end_date       TIMESTAMP WITH TIME ZONE,
        status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by     VARCHAR(100),
        updated_by     VARCHAR(100),
        CONSTRAINT pk_ownerships PRIMARY KEY (id)
      )
    `);

        // 8. authorization.authorizations
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "authorization".authorizations (
        id                 UUID DEFAULT gen_random_uuid(),
        person_id          UUID        NOT NULL,
        vehicle_id         UUID        NOT NULL,
        authorization_type "authorization".authorization_type_enum NOT NULL,
        status             "authorization".authorization_status_enum NOT NULL DEFAULT 'ACTIVE',
        valid_from         TIMESTAMP WITH TIME ZONE NOT NULL,
        valid_until        TIMESTAMP WITH TIME ZONE,
        allowed_days       JSONB,
        allowed_time_start TIME,
        allowed_time_end   TIME,
        access_point_id    UUID        NOT NULL,
        created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by         VARCHAR(100),
        updated_by         VARCHAR(100),
        CONSTRAINT pk_authorizations PRIMARY KEY (id)
      )
    `);

        // 9. authorization.quick_passes
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "authorization".quick_passes (
        id           UUID DEFAULT gen_random_uuid(),
        code         VARCHAR(50) NOT NULL,
        vehicle_id   UUID        NOT NULL,
        authorized_by UUID       NOT NULL,
        valid_from   TIMESTAMP WITH TIME ZONE NOT NULL,
        valid_until  TIMESTAMP WITH TIME ZONE NOT NULL,
        max_uses     INTEGER     DEFAULT 1,
        used_count   INTEGER     DEFAULT 0,
        status       "authorization".quick_pass_status_enum NOT NULL DEFAULT 'ACTIVE',
        created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by   VARCHAR(100),
        updated_by   VARCHAR(100),
        CONSTRAINT pk_quick_passes PRIMARY KEY (id),
        CONSTRAINT uq_quick_passes_code UNIQUE (code)
      )
    `);

        // 10. access_control.access_events
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.access_events (
        id                   UUID DEFAULT gen_random_uuid(),
        vehicle_plate        VARCHAR(20) NOT NULL,
        access_type          access_control.access_method_enum NOT NULL,
        decision             access_control.decision_enum NOT NULL,
        reason               VARCHAR(255),
        authorized_person_id UUID,
        biometric_evidence_id UUID,
        created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by           VARCHAR(100),
        updated_by           VARCHAR(100),
        CONSTRAINT pk_access_events PRIMARY KEY (id)
      )
    `);

        // 11. access_control.guest_invitations
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.guest_invitations (
        id            UUID DEFAULT gen_random_uuid(),
        vehicle_plate VARCHAR(20) NOT NULL,
        guest_name    VARCHAR(100) NOT NULL,
        invited_by    UUID         NOT NULL,
        valid_until   TIMESTAMP WITH TIME ZONE NOT NULL,
        status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
        access_code   VARCHAR(50)  NOT NULL,
        created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by    VARCHAR(100),
        updated_by    VARCHAR(100),
        CONSTRAINT pk_guest_invitations PRIMARY KEY (id),
        CONSTRAINT uq_guest_invitations_access_code UNIQUE (access_code)
      )
    `);

        // 12. biometric.facial_embeddings
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS biometric.facial_embeddings (
        id         UUID DEFAULT gen_random_uuid(),
        person_id  UUID          NOT NULL,
        embedding  vector(512)   NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100),
        CONSTRAINT pk_facial_embeddings PRIMARY KEY (id)
      )
    `);

        // 13. biometric.biometric_evidences
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS biometric.biometric_evidences (
        id                   UUID DEFAULT gen_random_uuid(),
        access_event_id      UUID         NOT NULL,
        vehicle_plate        VARCHAR(20)  NOT NULL,
        captured_embedding   JSONB        NOT NULL,
        matched_person_id    UUID,
        match_result         VARCHAR(20)  NOT NULL,
        similarity_score     DECIMAL(5,4),
        confidence_threshold DECIMAL(5,4) NOT NULL,
        status               biometric.embedding_status_enum NOT NULL,
        reason               TEXT,
        timestamp            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        metadata             JSONB,
        created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by           VARCHAR(100),
        updated_by           VARCHAR(100),
        CONSTRAINT pk_biometric_evidences PRIMARY KEY (id)
      )
    `);

        // 14. alerting.alerts
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.alerts (
        id          UUID DEFAULT gen_random_uuid(),
        type        VARCHAR(50)  NOT NULL,
        severity    alerting.alert_severity_enum NOT NULL,
        title       VARCHAR(255) NOT NULL,
        description TEXT         NOT NULL,
        source      VARCHAR(100) NOT NULL,
        status      VARCHAR(20)  NOT NULL DEFAULT 'OPEN',
        metadata    JSONB,
        created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by  VARCHAR(100),
        updated_by  VARCHAR(100),
        CONSTRAINT pk_alerts PRIMARY KEY (id)
      )
    `);

        // 15. alerting.notifications
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.notifications (
        id         UUID DEFAULT gen_random_uuid(),
        user_id    UUID         NOT NULL,
        title      VARCHAR(255) NOT NULL,
        message    TEXT         NOT NULL,
        type       VARCHAR(30)  NOT NULL,
        status     alerting.notification_status_enum NOT NULL DEFAULT 'UNREAD',
        read_at    TIMESTAMP WITH TIME ZONE,
        metadata   JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100),
        CONSTRAINT pk_notifications PRIMARY KEY (id)
      )
    `);

        // 16. alerting.notification_preferences
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.notification_preferences (
        id         UUID DEFAULT gen_random_uuid(),
        user_id    UUID      NOT NULL,
        channels   JSONB     NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100),
        CONSTRAINT pk_notification_preferences PRIMARY KEY (id),
        CONSTRAINT uq_notification_preferences_user_id UNIQUE (user_id)
      )
    `);


        // 17. Foreign Key constraints
        // registry.vehicles
        await queryRunner.query(`
      ALTER TABLE registry.vehicles
        ADD CONSTRAINT fk_vehicles_owner FOREIGN KEY (owner_id) REFERENCES registry.persons(id)
    `);

        // registry.ownerships
        await queryRunner.query(`
      ALTER TABLE registry.ownerships
        ADD CONSTRAINT fk_ownerships_person FOREIGN KEY (person_id) REFERENCES registry.persons(id),
        ADD CONSTRAINT fk_ownerships_vehicle FOREIGN KEY (vehicle_id) REFERENCES registry.vehicles(id)
    `);

        // authorization.authorizations
        await queryRunner.query(`
      ALTER TABLE "authorization".authorizations
        ADD CONSTRAINT fk_authorizations_person FOREIGN KEY (person_id) REFERENCES registry.persons(id),
        ADD CONSTRAINT fk_authorizations_vehicle FOREIGN KEY (vehicle_id) REFERENCES registry.vehicles(id)
    `);

        // authorization.quick_passes
        await queryRunner.query(`
      ALTER TABLE "authorization".quick_passes
        ADD CONSTRAINT fk_quick_passes_vehicle FOREIGN KEY (vehicle_id) REFERENCES registry.vehicles(id),
        ADD CONSTRAINT fk_quick_passes_authorized_by FOREIGN KEY (authorized_by) REFERENCES registry.persons(id)
    `);

        // biometric.facial_embeddings
        await queryRunner.query(`
      ALTER TABLE biometric.facial_embeddings
        ADD CONSTRAINT fk_facial_embeddings_person FOREIGN KEY (person_id) REFERENCES registry.persons(id)
    `);

        // biometric.biometric_evidences
        await queryRunner.query(`
      ALTER TABLE biometric.biometric_evidences
        ADD CONSTRAINT fk_biometric_evidences_access_event FOREIGN KEY (access_event_id) REFERENCES access_control.access_events(id)
    `);

        // access_control.guest_invitations
        await queryRunner.query(`
      ALTER TABLE access_control.guest_invitations
        ADD CONSTRAINT fk_guest_invitations_invited_by FOREIGN KEY (invited_by) REFERENCES registry.persons(id)
    `);

        // 18. Check constraints
        // registry.persons — email institucional
        await queryRunner.query(`
      ALTER TABLE registry.persons
        ADD CONSTRAINT ck_persons_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    `);

        // authorization.authorizations — valid_until debe ser posterior a valid_from
        await queryRunner.query(`
      ALTER TABLE "authorization".authorizations
        ADD CONSTRAINT ck_authorizations_valid_range CHECK (valid_until IS NULL OR valid_until > valid_from)
    `);

        // authorization.quick_passes — valid_until posterior a valid_from y used_count >= 0
        await queryRunner.query(`
      ALTER TABLE "authorization".quick_passes
        ADD CONSTRAINT ck_quick_passes_valid_range CHECK (valid_until > valid_from),
        ADD CONSTRAINT ck_quick_passes_used_count CHECK (used_count >= 0),
        ADD CONSTRAINT ck_quick_passes_max_uses CHECK (max_uses >= 1)
    `);

        // biometric.biometric_evidences — similarity_score entre 0 y 1
        await queryRunner.query(`
      ALTER TABLE biometric.biometric_evidences
        ADD CONSTRAINT ck_biometric_evidences_similarity CHECK (similarity_score IS NULL OR (similarity_score >= 0 AND similarity_score <= 1)),
        ADD CONSTRAINT ck_biometric_evidences_threshold CHECK (confidence_threshold >= 0 AND confidence_threshold <= 1)
    `);

        // registry.vehicles — year válido
        await queryRunner.query(`
      ALTER TABLE registry.vehicles
        ADD CONSTRAINT ck_vehicles_year CHECK (year >= 1900 AND year <= 2100)
    `);

        // 19. Indexes
        // registry
        await queryRunner.query(`CREATE INDEX idx_persons_is_active ON registry.persons (is_active)`);
        await queryRunner.query(`CREATE INDEX idx_persons_role ON registry.persons (role)`);
        await queryRunner.query(`CREATE INDEX idx_vehicles_is_active ON registry.vehicles (is_active)`);
        await queryRunner.query(`CREATE INDEX idx_ownerships_person ON registry.ownerships (person_id)`);
        await queryRunner.query(`CREATE INDEX idx_ownerships_vehicle ON registry.ownerships (vehicle_id)`);

        // authorization
        await queryRunner.query(`CREATE INDEX idx_authorizations_person_vehicle ON "authorization".authorizations (person_id, vehicle_id)`);
        await queryRunner.query(`CREATE INDEX idx_authorizations_status ON "authorization".authorizations (status)`);
        await queryRunner.query(`CREATE INDEX idx_quick_passes_vehicle ON "authorization".quick_passes (vehicle_id)`);
        await queryRunner.query(`CREATE INDEX idx_quick_passes_status ON "authorization".quick_passes (status)`);

        // access_control
        await queryRunner.query(`CREATE INDEX idx_access_events_vehicle_plate ON access_control.access_events (vehicle_plate)`);
        await queryRunner.query(`CREATE INDEX idx_access_events_decision ON access_control.access_events (decision)`);
        await queryRunner.query(`CREATE INDEX idx_access_events_created_at ON access_control.access_events (created_at)`);
        await queryRunner.query(`CREATE INDEX idx_guest_invitations_vehicle_plate ON access_control.guest_invitations (vehicle_plate)`);

        // biometric
        await queryRunner.query(`CREATE INDEX idx_facial_embeddings_person ON biometric.facial_embeddings (person_id)`);
        await queryRunner.query(`CREATE INDEX idx_biometric_evidences_access_event ON biometric.biometric_evidences (access_event_id)`);

        // alerting
        await queryRunner.query(`CREATE INDEX idx_alerts_severity ON alerting.alerts (severity)`);
        await queryRunner.query(`CREATE INDEX idx_alerts_status ON alerting.alerts (status)`);
        await queryRunner.query(`CREATE INDEX idx_notifications_user ON alerting.notifications (user_id)`);
        await queryRunner.query(`CREATE INDEX idx_notifications_status ON alerting.notifications (status)`);

        // 20. Triggers de auditoría
        const tables = [
            'access_control.access_events',
            'access_control.guest_invitations',
            '"authorization".authorizations',
            '"authorization".quick_passes',
            'registry.persons',
            'registry.vehicles',
            'registry.ownerships',
            'biometric.facial_embeddings',
            'biometric.biometric_evidences',
            'alerting.alerts',
            'alerting.notifications',
            'alerting.notification_preferences',
        ];

        for (const table of tables) {
            const triggerName = table.replace(/\./g, '_').replace(/"/g, '');
            await queryRunner.query(`
        DROP TRIGGER IF EXISTS update_${triggerName}_updated_at ON ${table}
      `);
            await queryRunner.query(`
        CREATE TRIGGER update_${triggerName}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Triggers
        const tables = [
            'access_control.access_events',
            'access_control.guest_invitations',
            '"authorization".authorizations',
            '"authorization".quick_passes',
            'registry.persons',
            'registry.vehicles',
            'registry.ownerships',
            'biometric.facial_embeddings',
            'biometric.biometric_evidences',
            'alerting.alerts',
            'alerting.notifications',
            'alerting.notification_preferences',
        ];

        for (const table of tables) {
            const triggerName = table.replace(/\./g, '_').replace(/"/g, '');
            await queryRunner.query(
                `DROP TRIGGER IF EXISTS update_${triggerName}_updated_at ON ${table}`,
            );
        }

        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);

        // Tablas
        await queryRunner.query(`DROP TABLE IF EXISTS biometric.facial_embeddings`);
        await queryRunner.query(`DROP TABLE IF EXISTS biometric.biometric_evidences`);
        await queryRunner.query(`DROP TABLE IF EXISTS registry.ownerships`);
        await queryRunner.query(`DROP TABLE IF EXISTS registry.vehicles`);
        await queryRunner.query(`DROP TABLE IF EXISTS registry.persons`);
        await queryRunner.query(`DROP TABLE IF EXISTS "authorization".quick_passes`);
        await queryRunner.query(`DROP TABLE IF EXISTS "authorization".authorizations`);
        await queryRunner.query(`DROP TABLE IF EXISTS access_control.guest_invitations`);
        await queryRunner.query(`DROP TABLE IF EXISTS access_control.access_events`);
        await queryRunner.query(`DROP TABLE IF EXISTS alerting.notification_preferences`);
        await queryRunner.query(`DROP TABLE IF EXISTS alerting.notifications`);
        await queryRunner.query(`DROP TABLE IF EXISTS alerting.alerts`);

        // Enum types
        // Auth
        await queryRunner.query(`DROP TYPE IF EXISTS auth.user_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS auth.auth_role_enum`);
        // Alerting
        await queryRunner.query(`DROP TYPE IF EXISTS alerting.notification_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS alerting.alert_severity_enum`);
        // Biometric
        await queryRunner.query(`DROP TYPE IF EXISTS biometric.embedding_status_enum`);
        // Access Control
        await queryRunner.query(`DROP TYPE IF EXISTS access_control.access_method_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS access_control.decision_enum`);
        // Authorization
        await queryRunner.query(`DROP TYPE IF EXISTS "authorization".quick_pass_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS "authorization".authorization_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS "authorization".authorization_type_enum`);
        // Registry
        await queryRunner.query(`DROP TYPE IF EXISTS registry.institutional_role_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS registry.vehicle_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS registry.vehicle_type_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS registry.person_type_enum`);

        // Esquemas
        await queryRunner.query(`DROP SCHEMA IF EXISTS access_control CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "authorization" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS registry CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS biometric CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS alerting CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS auth CASCADE`);

        // Extensión
        await queryRunner.query(`DROP EXTENSION IF EXISTS vector CASCADE`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE`);
    }
}