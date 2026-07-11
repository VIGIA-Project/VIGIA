const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://vigia_user:vigia_secret@localhost:5434/vigia_db' });
async function test() {
  const pases = await pool.query('SELECT estado_pase, count(*) FROM "authorization".pases_acceso_rapido GROUP BY estado_pase');
  console.log("Pases Rapidos:", pases.rows);
  const temporales = await pool.query('SELECT estado_autorizacion, count(*) FROM "authorization".permisos_temporales GROUP BY estado_autorizacion');
  console.log("Permisos Temporales:", temporales.rows);
  pool.end();
}
test();
