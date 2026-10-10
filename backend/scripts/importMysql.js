import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execute, pool, transaction } from '../src/config/database.js';

const backendDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backupDir = resolve(backendDir, '.migration');
const tables = ['application_reference_sequences', 'admins', 'candidates', 'candidate_skills', 'projects', 'scoring_criteria', 'candidate_score_details', 'evaluations', 'candidate_history'];
const booleanColumns = new Set(['is_active', 'program_available', 'used_ai']);
let source;

try {
  // The original MySQL credentials remain only in an ignored backup file.
  const config = dotenv.parse(await readFile(resolve(backupDir, 'mysql.env'), 'utf8'));
  source = await mysql.createConnection({
    host: config.DB_HOST || '127.0.0.1',
    port: Number(config.DB_PORT || 3306),
    database: config.DB_NAME || 'skullvi_talent_engine',
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    timezone: 'Z'
  });
  await source.query("SET time_zone = '+00:00'");
  await source.query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
  const snapshot = {};
  for (const table of tables) {
    const [rows] = await source.query(`SELECT * FROM \`${table}\``);
    snapshot[table] = rows;
  }
  await source.commit();
  await mkdir(backupDir, { recursive: true });
  await writeFile(resolve(backupDir, 'mysql-data.json'), JSON.stringify(snapshot, null, 2));

  if (!process.argv.includes('--export-only')) await transaction(async (connection) => {
    await execute('SELECT pg_advisory_xact_lock(hashtext($1))', ['skullvi-mysql-import'], connection);
    const occupied = await execute('SELECT COUNT(*) AS total FROM candidates', [], connection);
    const admins = await execute('SELECT COUNT(*) AS total FROM admins', [], connection);
    if (Number(occupied[0].total) || Number(admins[0].total)) {
      throw new Error('Import requires empty candidate and admin tables. Existing data was preserved.');
    }
    await execute('DELETE FROM scoring_criteria', [], connection);
    for (const table of tables) {
      for (const row of snapshot[table]) {
        const columns = Object.keys(row);
        const values = columns.map((column) => booleanColumns.has(column) ? Boolean(row[column]) : row[column]);
        await execute(
          `INSERT INTO ${table} (${columns.map((column) => `"${column}"`).join(', ')}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})`,
          values, connection
        );
      }
      if (table !== 'application_reference_sequences') {
        await execute(`SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), EXISTS(SELECT 1 FROM ${table}))`, [table], connection);
      }
      console.log(`Imported ${table}: ${snapshot[table].length} row(s)`);
    }
  });
  console.log(process.argv.includes('--export-only')
    ? 'MySQL backup saved in the ignored .migration directory.'
    : 'MySQL import completed; admin password hashes were preserved.');
} catch (error) {
  console.error('MySQL import failed:', error.message);
  process.exitCode = 1;
} finally {
  if (source) await source.end();
  await pool.end();
}
