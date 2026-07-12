import { DataSource } from 'typeorm';
import { MiembroGrupoFamiliarOrmEntity } from './apps/backend/src/modules/authorization/infrastructure/entities/miembro-grupo-familiar.orm-entity';

const ds = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'vigia_user',
  password: 'vigia_secret',
  database: 'vigia_db',
  entities: [MiembroGrupoFamiliarOrmEntity],
});

async function run() {
  await ds.initialize();
  const repo = ds.getRepository(MiembroGrupoFamiliarOrmEntity);
  const m = await repo.findOne({ where: { id: '17dba5ab-fef5-49bd-83a9-144cc3356268' } });
  if (!m) {
    console.log("No found");
    return;
  }
  console.log("Found:", m.estado);
  m.estado = 'REVOCADA';
  try {
    await repo.save(m);
    console.log("Saved successfully");
  } catch (e) {
    console.error("Error saving:", e);
  }
  await ds.destroy();
}
run();
