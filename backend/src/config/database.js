import pg from 'pg';
import { env } from './env.js';

pg.types.setTypeParser(1700, Number);

if (!/^[a-z_][a-z0-9_]*$/.test(env.db.schema)) {
  throw new Error('DB_SCHEMA must be a lowercase PostgreSQL identifier.');
}

export const pool = new pg.Pool({
  ...(env.db.url ? { connectionString: env.db.url } : {
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password
  }),
  ssl: env.db.ssl ? { rejectUnauthorized: true } : undefined,
  options: `-c search_path=${env.db.schema}`,
  max: env.db.connectionLimit,
  connectionTimeoutMillis: env.db.connectionTimeoutMillis,
  idleTimeoutMillis: 30000
});

pool.on('error', (error) => console.error('PostgreSQL pool error:', error.message));

export async function execute(sql, params = [], connection = null) {
  const executor = connection || pool;
  const { rows } = await executor.query(sql, params);
  return rows;
}

export async function transaction(callback) {
  const connection = await pool.connect();
  let discardConnection = false;

  try {
    await connection.query('BEGIN');
    const result = await callback(connection);
    await connection.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await connection.query('ROLLBACK');
    } catch {
      discardConnection = true;
    }
    throw error;
  } finally {
    connection.release(discardConnection);
  }
}

