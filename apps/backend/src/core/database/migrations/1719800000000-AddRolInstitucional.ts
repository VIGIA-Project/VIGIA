import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolInstitucional1719800000000 implements MigrationInterface {
    name = 'AddRolInstitucional1719800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registry"."personas" ADD "rol_institucional" varchar(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registry"."personas" DROP COLUMN "rol_institucional"`);
    }
}
