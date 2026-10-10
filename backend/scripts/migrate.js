import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, transaction, execute } from '../src/config/database.js';
import { env } from '../src/config/env.js';

const databaseDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../database');

try {
  await transaction(async (connection) => {
    await execute('SELECT pg_advisory_xact_lock(hashtext($1))', [`skullvi-migrations:${env.db.schema}`], connection);
    await execute(`CREATE SCHEMA IF NOT EXISTS "${env.db.schema}"`, [], connection);
    await execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, [], connection);

    const migrations = [
      ['000_initial_schema', resolve(databaseDir, 'schema.sql')],
      ['001_default_criteria', resolve(databaseDir, 'defaults.sql')],
      ...(await readdir(resolve(databaseDir, 'migrations')))
        .filter((name) => name.endsWith('.sql')).sort()
        .map((name) => [name, resolve(databaseDir, 'migrations', name)])
    ];
    for (const [version, path] of migrations) {
      const applied = await execute('SELECT version FROM schema_migrations WHERE version = $1', [version], connection);
      if (applied.length) continue;
      await connection.query(await readFile(path, 'utf8'));
      await execute('INSERT INTO schema_migrations (version) VALUES ($1)', [version], connection);
      console.log(`Migration applied: ${version}`);
    }
  });
  console.log('PostgreSQL migrations: OK');
} catch (error) {
  console.error('PostgreSQL migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
