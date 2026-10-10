import { execute } from '../config/database.js';

function buildFilters(filters = {}) {
  const where = [];
  const params = [];

  if (filters.domain) {
    where.push(`domain = $${params.length + 1}`);
    params.push(filters.domain);
  }
  if (filters.status) {
    where.push(`status = $${params.length + 1}`);
    params.push(filters.status);
  }
  if (filters.minScore !== undefined) {
    where.push(`COALESCE(final_score, automatic_score, 0) >= $${params.length + 1}`);
    params.push(filters.minScore);
  }
  if (filters.maxScore !== undefined) {
    where.push(`COALESCE(final_score, automatic_score, 0) <= $${params.length + 1}`);
    params.push(filters.maxScore);
  }

  return { clause: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

export async function getRanking(filters = {}) {
  const { clause, params } = buildFilters(filters);
  const rows = await execute(
    `SELECT id AS "candidateId", application_reference AS "applicationReference",
      CONCAT(first_name, ' ', last_name) AS "fullName", domain,
      automatic_score AS "automaticScore", human_score AS "humanScore", final_score AS "finalScore",
      COALESCE(final_score, automatic_score, 0) AS "rankingScore",
      qualification, status
     FROM candidates
     ${clause}
     ORDER BY "rankingScore" DESC, submitted_at ASC, id ASC`,
    params
  );

  return rows.map((candidate, index) => ({ rank: index + 1, ...candidate }));
}

