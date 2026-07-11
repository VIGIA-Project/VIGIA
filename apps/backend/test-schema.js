const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://vigia_user:vigia_secret@localhost:5434/vigia_db' });
async function test() {
  try {
    const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'access_control'`);
    console.log("Tables:", res.rows.map(r => r.table_name));
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
test();
