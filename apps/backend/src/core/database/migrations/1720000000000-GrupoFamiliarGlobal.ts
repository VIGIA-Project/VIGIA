import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Refactor: el grupo familiar (antes "Autorización Permanente") se vincula
 * al propietario, no a un vehículo individual. Una persona del grupo
 * familiar queda autorizada para conducir cualquiera de los vehículos
 * activos del propietario.
 */
export class GrupoFamiliarGlobal1720000000000 implements MigrationInterface {
    name = 'GrupoFamiliarGlobal1720000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "authorization".autorizaciones_permanentes
      RENAME TO miembros_grupo_familiar
    `);

        await queryRunner.query(`
      DROP INDEX IF EXISTS "authorization".idx_aut_perm_vehiculo_estado
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "authorization".uq_aut_perm_activa_vehiculo_persona
    `);

        await queryRunner.query(`
      ALTER TABLE "authorization".miembros_grupo_familiar
      DROP COLUMN IF EXISTS vehiculo_id
    `);
        await queryRunner.query(`
      ALTER TABLE "authorization".miembros_grupo_familiar
      DROP COLUMN IF EXISTS tipo
    `);

        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_miembros_grupo_familiar_propietario_estado
      ON "authorization".miembros_grupo_familiar (propietario_id, estado)
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP INDEX IF EXISTS "authorization".idx_miembros_grupo_familiar_propietario_estado
    `);

        await queryRunner.query(`
      ALTER TABLE "authorization".miembros_grupo_familiar
      ADD COLUMN IF NOT EXISTS vehiculo_id UUID
    `);
        await queryRunner.query(`
      ALTER TABLE "authorization".miembros_grupo_familiar
      ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) NOT NULL DEFAULT 'PERMANENTE'
    `);

        await queryRunner.query(`
      ALTER TABLE "authorization".miembros_grupo_familiar
      RENAME TO autorizaciones_permanentes
    `);
    }
}
