import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlacaToPases1720760000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authorization".pases_acceso_rapido ADD COLUMN IF NOT EXISTS "placa" VARCHAR(10)`,
    );
    // Since there might be existing records, update them to have a default placa or leave null if possible. 
    // The entity requires it, so we'll fill a dummy value if we set NOT NULL.
    await queryRunner.query(
      `UPDATE "authorization".pases_acceso_rapido SET "placa" = 'N/A' WHERE "placa" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "authorization".pases_acceso_rapido ALTER COLUMN "placa" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "authorization".pases_acceso_rapido DROP COLUMN "placa"`);
  }
}
