const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://vigia_user:vigia_secret@localhost:5434/vigia_db' });
async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS access_control.pases_garita (
        pase_garita_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        placa_vehiculo VARCHAR(15) NOT NULL,
        tipo_movimiento VARCHAR(20) NOT NULL,
        tipo_visitante VARCHAR(50) NOT NULL,
        nombre_visitante VARCHAR(100) NOT NULL,
        documento_visitante VARCHAR(30),
        destino VARCHAR(150) NOT NULL,
        duracion_horas NUMERIC(4,2) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(20) DEFAULT 'ACTIVO' NOT NULL,
        creado_por_guardia_id UUID NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        finalizado_at TIMESTAMPTZ
      );
    `);
    console.log("Table created.");
  } catch (e) { console.error(e); } finally { pool.end(); }
}
setup();
