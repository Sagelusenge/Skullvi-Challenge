import { pool, execute } from '../src/config/database.js';

async function checkDatabase() {
  const health = await execute('SELECT 1 AS ok');
  const criteria = await execute('SELECT COUNT(*) AS total FROM scoring_criteria');

  return {
    connected: health[0]?.ok === 1,
    scoringCriteria: Number(criteria[0]?.total ?? 0)
  };
}

try {
  const result = await checkDatabase();
  console.log('Database connection: OK');
  console.log(`Scoring criteria configured: ${result.scoringCriteria}`);

  if (result.scoringCriteria < 5) {
    console.log('Seed data seems incomplete. Run database/seed.sql.');
    process.exitCode = 1;
  }
} catch (error) {
  console.error('Database connection: FAILED');
  console.error(error.message);
  console.error('Check backend/.env, PostgreSQL status, and run npm run db:migrate.');
  process.exitCode = 1;
} finally {
  await pool.end();
}

