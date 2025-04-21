// database/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Puerto por defecto de PostgreSQL
});

async function connect() {
  try {
    const client = await pool.connect();
    console.log('Conectado a la base de datos PostgreSQL');
    client.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error; // Re-lanza el error para que el controlador pueda manejarlo
  }
}

export { connect, query };