import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Agrega la columna duracion_autorizada_min a access_control.eventos_acceso.
 * La entidad ORM ya la declara pero la migración inicial nunca la creó,
 * provocando errores 500 al hacer SELECT sobre la tabla.
 */
export class AddDuracionAutorizadaMin1720800000000 implements MigrationInterface {
  name = 'AddDuracionAutorizadaMin1720800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE access_control.eventos_acceso
      ADD COLUMN IF NOT EXISTS duracion_autorizada_min INTEGER
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE access_control.eventos_acceso
      DROP COLUMN IF EXISTS duracion_autorizada_min
    `);
  }
}
