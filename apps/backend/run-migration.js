const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function run() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5434,
    user: process.env.DB_USERNAME || 'vigia_user',
    password: process.env.DB_PASSWORD || 'vigia_secret',
    database: process.env.DB_NAME || 'vigia_db',
  });
  
  await client.connect();
  await client.query(`ALTER TABLE "authorization".pases_acceso_rapido ADD COLUMN IF NOT EXISTS "placa" VARCHAR(10)`);
  await client.query(`UPDATE "authorization".pases_acceso_rapido SET "placa" = 'N/A' WHERE "placa" IS NULL`);
  await client.query(`ALTER TABLE "authorization".pases_acceso_rapido ALTER COLUMN "placa" SET NOT NULL`);
  console.log("Migration done!");
  await client.end();
}
run().catch(console.error);
