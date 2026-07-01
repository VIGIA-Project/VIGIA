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

        // 3. Función de auditoría
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

        // 4. registry.persons
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.persons (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name    VARCHAR(50)  NOT NULL,
        last_name     VARCHAR(50)  NOT NULL,
        email         VARCHAR(100) UNIQUE NOT NULL,
        phone         VARCHAR(20),
        document_id   VARCHAR(20)  UNIQUE NOT NULL,
        document_type VARCHAR(20)  NOT NULL,
        role          VARCHAR(30)  NOT NULL,
        status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        created_by    VARCHAR(100),
        updated_by    VARCHAR(100)
      )
    `);

        // 5. registry.vehicles
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.vehicles (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plate_number VARCHAR(20) UNIQUE NOT NULL,
        make         VARCHAR(50) NOT NULL,
        model        VARCHAR(50) NOT NULL,
        year         INTEGER     NOT NULL,
        color        VARCHAR(30) NOT NULL,
        status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
        created_by   VARCHAR(100),
        updated_by   VARCHAR(100)
      )
    `);

        // 6. registry.ownerships
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS registry.ownerships (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        person_id      UUID        NOT NULL,
        vehicle_id     UUID        NOT NULL,
        ownership_type VARCHAR(30) NOT NULL,
        start_date     TIMESTAMP   NOT NULL DEFAULT NOW(),
        end_date       TIMESTAMP,
        status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
        created_by     VARCHAR(100),
        updated_by     VARCHAR(100)
      )
    `);

        // 7. authorization.authorizations
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "authorization".authorizations (
        id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        person_id          UUID        NOT NULL,
        vehicle_id         UUID        NOT NULL,
        authorization_type VARCHAR(30) NOT NULL,
        status             VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        valid_from         TIMESTAMP   NOT NULL,
        valid_until        TIMESTAMP,
        created_at         TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at         TIMESTAMP   NOT NULL DEFAULT NOW(),
        created_by         VARCHAR(100),
        updated_by         VARCHAR(100)
      )
    `);

        // 8. authorization.quick_passes
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "authorization".quick_passes (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code         VARCHAR(50) UNIQUE NOT NULL,
        vehicle_id   UUID        NOT NULL,
        authorized_by UUID       NOT NULL,
        valid_from   TIMESTAMP   NOT NULL,
        valid_until  TIMESTAMP   NOT NULL,
        max_uses     INTEGER     DEFAULT 1,
        used_count   INTEGER     DEFAULT 0,
        status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
        created_by   VARCHAR(100),
        updated_by   VARCHAR(100)
      )
    `);

        // 9. access_control.access_events
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.access_events (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_plate        VARCHAR(20) NOT NULL,
        access_type          VARCHAR(50) NOT NULL,
        decision             VARCHAR(20) NOT NULL,
        reason               VARCHAR(255),
        authorized_person_id UUID,
        biometric_evidence_id UUID,
        created_at           TIMESTAMP   NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMP   NOT NULL DEFAULT NOW(),
        created_by           VARCHAR(100),
        updated_by           VARCHAR(100)
      )
    `);

        // 10. access_control.guest_invitations
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS access_control.guest_invitations (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_plate VARCHAR(20) NOT NULL,
        guest_name    VARCHAR(100) NOT NULL,
        invited_by    UUID         NOT NULL,
        valid_until   TIMESTAMP    NOT NULL,
        status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
        access_code   VARCHAR(50)  UNIQUE NOT NULL,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        created_by    VARCHAR(100),
        updated_by    VARCHAR(100)
      )
    `);

        // 11. biometric.facial_embeddings
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS biometric.facial_embeddings (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        person_id  UUID          NOT NULL,
        embedding  vector(512)   NOT NULL,
        created_at TIMESTAMP     NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP     NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100)
      )
    `);

        // 12. biometric.biometric_evidences
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS biometric.biometric_evidences (
        id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        access_event_id      UUID         NOT NULL,
        vehicle_plate        VARCHAR(20)  NOT NULL,
        captured_embedding   JSONB        NOT NULL,
        matched_person_id    UUID,
        match_result         VARCHAR(20)  NOT NULL,
        similarity_score     DECIMAL(5,4),
        confidence_threshold DECIMAL(5,4) NOT NULL,
        status               VARCHAR(30)  NOT NULL,
        reason               TEXT,
        timestamp            TIMESTAMP    NOT NULL DEFAULT NOW(),
        metadata             JSONB,
        created_at           TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMP    NOT NULL DEFAULT NOW(),
        created_by           VARCHAR(100),
        updated_by           VARCHAR(100)
      )
    `);

        // 13. alerting.alerts
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.alerts (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type        VARCHAR(50)  NOT NULL,
        severity    VARCHAR(20)  NOT NULL,
        title       VARCHAR(255) NOT NULL,
        description TEXT         NOT NULL,
        source      VARCHAR(100) NOT NULL,
        status      VARCHAR(20)  NOT NULL DEFAULT 'OPEN',
        metadata    JSONB,
        created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
        created_by  VARCHAR(100),
        updated_by  VARCHAR(100)
      )
    `);

        // 14. alerting.notifications
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.notifications (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID         NOT NULL,
        title      VARCHAR(255) NOT NULL,
        message    TEXT         NOT NULL,
        type       VARCHAR(30)  NOT NULL,
        status     VARCHAR(20)  NOT NULL DEFAULT 'SENT',
        read_at    TIMESTAMP,
        metadata   JSONB,
        created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100)
      )
    `);

        // 15. alerting.notification_preferences
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS alerting.notification_preferences (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID      UNIQUE NOT NULL,
        channels   JSONB     NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_by VARCHAR(100),
        updated_by VARCHAR(100)
      )
    `);

        // 16. Triggers de auditoría
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