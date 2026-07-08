import { MigrationInterface, QueryRunner } from 'typeorm';

export class RegistryVIG751719700000000 implements MigrationInterface {
    name = 'RegistryVIG751719700000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar estado_biometrico a registry.personas
        await queryRunner.query(`
      ALTER TABLE registry.personas
      ADD COLUMN IF NOT EXISTS estado_biometrico VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
    `);

        // Agregar vehiculo_id a registry.asignaciones_rol
        await queryRunner.query(`
      ALTER TABLE registry.asignaciones_rol
      ADD COLUMN IF NOT EXISTS vehiculo_id UUID
    `);

        // Actualizar enum rol_institucional para incluir los nuevos roles
        await queryRunner.query(`
      ALTER TYPE registry.rol_institucional_enum
      ADD VALUE IF NOT EXISTS 'PROPIETARIO'
    `);
        await queryRunner.query(`
      ALTER TYPE registry.rol_institucional_enum
      ADD VALUE IF NOT EXISTS 'FAMILIAR_AUTORIZADO'
    `);
        await queryRunner.query(`
      ALTER TYPE registry.rol_institucional_enum
      ADD VALUE IF NOT EXISTS 'CONDUCTOR_PERMANENTE'
    `);
        await queryRunner.query(`
      ALTER TYPE registry.rol_institucional_enum
      ADD VALUE IF NOT EXISTS 'PERSONA_AUTORIZADA'
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE registry.personas DROP COLUMN IF EXISTS estado_biometrico
    `);
        await queryRunner.query(`
      ALTER TABLE registry.asignaciones_rol DROP COLUMN IF EXISTS vehiculo_id
    `);
    }
}