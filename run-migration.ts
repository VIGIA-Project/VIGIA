import { DataSource } from "typeorm";
import { AppDataSource } from "./apps/backend/src/core/database/data-source";

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.query(`ALTER TABLE "authorization".pases_acceso_rapido ADD COLUMN IF NOT EXISTS "placa" VARCHAR(10)`);
  await AppDataSource.query(`UPDATE "authorization".pases_acceso_rapido SET "placa" = 'N/A' WHERE "placa" IS NULL`);
  await AppDataSource.query(`ALTER TABLE "authorization".pases_acceso_rapido ALTER COLUMN "placa" SET NOT NULL`);
  console.log("Migration done!");
  process.exit(0);
}
run().catch(console.error);
