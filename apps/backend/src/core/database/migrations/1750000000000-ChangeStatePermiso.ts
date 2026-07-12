import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRevocadoToRevocada1750000000000 implements MigrationInterface {
    public transaction = false;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TYPE "authorization".estado_permiso_temporal_enum
      RENAME VALUE 'REVOCADO' TO 'REVOCADA';
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TYPE "authorization".estado_permiso_temporal_enum
      RENAME VALUE 'REVOCADA' TO 'REVOCADO';
    `);
    }
}