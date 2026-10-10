import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import request from 'supertest';

const schema = `skullvi_test_${randomUUID().replaceAll('-', '')}`;
process.env.DB_SCHEMA = schema;
const { pool, execute, transaction } = await import('../src/config/database.js');
const { default: app } = await import('../src/app.js');
const { createAdmin } = await import('../src/repositories/admin.repository.js');
const candidates = await import('../src/repositories/candidate.repository.js');
const { submitCandidate } = await import('../src/services/candidate.service.js');
const migrateScript = resolve(dirname(fileURLToPath(import.meta.url)), '../scripts/migrate.js');
let token;
let candidateId;
let schemaCreated = false;

const application = {
  firstName: 'Integration', lastName: 'Candidate', email: 'integration@example.com',
  phone: '+243970000000', country: 'RDC', city: 'Goma', domain: 'Backend',
  experienceLevel: 'Junior', educationLevel: 'Licence', currentStatus: 'Student',
  yearsExperience: 1, skills: [{ name: 'PostgreSQL', level: 'intermediate' }],
  motivation: 'Je veux apprendre a construire des API fiables pour des projets utiles.',
  learningGoal: 'Comprendre les transactions et les tests du backend.',
  preferredDomain: 'Backend', weeklyAvailability: 15, programAvailable: true,
  project: {
    name: 'Integration project', description: 'Application de test des transactions PostgreSQL.',
    problemSolved: 'Verifier le stockage des candidatures.', candidateRole: 'Developer',
    personalContribution: 'Conception du backend et des tests.', technologies: 'Express, PostgreSQL',
    githubUrl: 'https://github.com/example/integration', usedAi: false
  }
};

before(async () => {
  await pool.query(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  // Child processes exercise the actual migration runner, including reruns.
  execFileSync(process.execPath, [migrateScript], { env: process.env, timeout: 60000, stdio: 'pipe' });
  await execute("UPDATE scoring_criteria SET criterion_name = 'Customized motivation' WHERE criterion_key = 'motivation'");
  execFileSync(process.execPath, [migrateScript], { env: process.env, timeout: 60000, stdio: 'pipe' });
  assert.equal((await execute("SELECT criterion_name FROM scoring_criteria WHERE criterion_key = 'motivation'"))[0].criterion_name, 'Customized motivation');
  assert.equal((await execute('SELECT COUNT(*) AS total FROM candidates'))[0].total, '0');
  assert.equal((await execute('SELECT COUNT(*) AS total FROM scoring_criteria'))[0].total, '5');
  assert.equal((await execute('SELECT COUNT(*) AS total FROM schema_migrations'))[0].total, '2');
  await createAdmin({
    firstName: 'Test', lastName: 'Admin', email: 'test@example.com',
    passwordHash: await bcrypt.hash('integration-password', 4), isActive: true
  });
  const response = await request(app).post('/api/v1/auth/login').send({
    email: 'TEST@example.com', password: 'integration-password'
  });
  assert.equal(response.status, 200);
  token = response.body.data.token;
});

after(async () => {
  try {
    if (schemaCreated) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  } finally {
    await pool.end();
  }
});

test('candidate intake preserves API casing, numbers, booleans, projects and score details', async () => {
  const response = await request(app).post('/api/v1/candidates').send(application);
  assert.equal(response.status, 201);
  assert.match(response.body.data.applicationReference, /^SK-\d{4}-\d{4,}$/);
  const list = await request(app).get('/api/v1/candidates')
    .query({ search: 'INTEGRATION', domain: 'Backend', status: 'new', minScore: 0, maxScore: 100, limit: 1, page: 1 })
    .auth(token, { type: 'bearer' });
  assert.equal(list.status, 200);
  assert.equal(list.body.data.length, 1);
  assert.equal(list.body.meta.total, 1);
  candidateId = list.body.data[0].id;
  assert.equal(list.body.data[0].firstName, application.firstName);
  assert.equal(typeof list.body.data[0].automaticScore, 'number');
  assert.equal(list.body.data[0].programAvailable, true);
  const detail = await request(app).get(`/api/v1/candidates/${candidateId}`).auth(token, { type: 'bearer' });
  assert.equal(detail.status, 200);
  assert.equal(detail.body.data.project.githubUrl, application.project.githubUrl);
  assert.equal(detail.body.data.scoreDetails.length, 5);
  assert.equal(detail.body.data.history.length, 2);
});

test('evaluation, status, stats and ranking use PostgreSQL and return numeric scores', async () => {
  const evaluation = await request(app).post(`/api/v1/candidates/${candidateId}/evaluations`)
    .auth(token, { type: 'bearer' }).send({
      technicalSkills: 8, problemSolving: 9, projectQuality: 8,
      motivation: 9, learningPotential: 9, comment: 'Integration review'
    });
  assert.equal(evaluation.status, 201);
  assert.equal(evaluation.body.data.humanScore, 86);
  const reviews = await request(app).get('/api/v1/evaluations').auth(token, { type: 'bearer' });
  assert.equal(reviews.status, 200);
  assert.equal(reviews.body.data[0].adminName, 'Test Admin');
  const status = await request(app).patch(`/api/v1/candidates/${candidateId}/status`)
    .auth(token, { type: 'bearer' }).send({ status: 'shortlisted' });
  assert.equal(status.status, 200);
  const stats = await request(app).get('/api/v1/dashboard/stats').auth(token, { type: 'bearer' });
  assert.equal(stats.status, 200);
  assert.equal(stats.body.data.totalCandidates, 1);
  assert.equal(stats.body.data.shortlisted, 1);
  const ranking = await request(app).get('/api/v1/ranking')
    .query({ domain: 'Backend', status: 'shortlisted', minScore: 0, maxScore: 100 })
    .auth(token, { type: 'bearer' });
  assert.equal(ranking.status, 200);
  assert.equal(ranking.body.data[0].candidateId, candidateId);
  assert.equal(typeof ranking.body.data[0].rankingScore, 'number');
  const recalculate = await request(app).post(`/api/v1/candidates/${candidateId}/recalculate-score`)
    .auth(token, { type: 'bearer' });
  assert.equal(recalculate.status, 200);
  const recent = await request(app).get('/api/v1/dashboard/recent-candidates').auth(token, { type: 'bearer' });
  assert.equal(recent.status, 200);
  assert.equal(recent.body.data[0].candidateId, candidateId);
  const criteria = await request(app).get('/api/v1/scoring/criteria').auth(token, { type: 'bearer' });
  assert.equal(criteria.status, 200);
  const updated = await request(app).put('/api/v1/scoring/criteria').auth(token, { type: 'bearer' }).send({
    criteria: criteria.body.data.map((criterion) => ({
      criterionKey: criterion.criterion_key, weight: criterion.weight,
      maxScore: criterion.max_score, isActive: criterion.isActive
    }))
  });
  assert.equal(updated.status, 200);
});

test('parallel applications receive unique references; failed submissions fully roll back', async () => {
  const results = await Promise.all(Array.from({ length: 8 }, (_, index) => submitCandidate({
    ...application, email: `concurrent${index}@example.com`
  })));
  assert.equal(new Set(results.map((result) => result.applicationReference)).size, 8);
  const beforeCount = (await execute('SELECT COUNT(*) AS total FROM candidates'))[0].total;
  await assert.rejects(submitCandidate({
    ...application, skills: [{ name: 'PostgreSQL', level: 'invalid' }]
  }));
  assert.equal((await execute('SELECT COUNT(*) AS total FROM candidates'))[0].total, beforeCount);
  await assert.rejects(transaction(async (connection) => {
    await candidates.generateApplicationReference(connection);
    throw new Error('Rollback test');
  }), /Rollback test/);
  const readiness = await request(app).get('/api/v1/health/ready');
  assert.equal(readiness.status, 200);
  const unknown = await request(app).get('/api/v1/unknown');
  assert.equal(unknown.status, 404);
  assert.equal(unknown.body.success, false);
});
