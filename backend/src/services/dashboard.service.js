import { execute } from '../config/database.js';

export async function getStats() {
  const rows = await execute(
    `SELECT
      COUNT(*) AS "totalCandidates",
      COUNT(*) FILTER (WHERE status = 'new') AS "newCandidates",
      COUNT(*) FILTER (WHERE status = 'to_review') AS "toReview",
      COUNT(*) FILTER (WHERE status = 'shortlisted') AS shortlisted,
      COUNT(*) FILTER (WHERE status = 'selected') AS selected,
      ROUND(AVG(automatic_score), 2) AS "averageAutomaticScore",
      ROUND(AVG(final_score), 2) AS "averageFinalScore"
     FROM candidates`
  );

  return Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key, value === null ? null : Number(value)]));
}

export async function getRecentCandidates(limit = 10) {
  return execute(
    `SELECT id AS "candidateId", application_reference AS "applicationReference",
      CONCAT(first_name, ' ', last_name) AS "fullName", email, domain, status,
      automatic_score AS "automaticScore", final_score AS "finalScore", qualification,
      submitted_at AS "submittedAt"
     FROM candidates
     ORDER BY submitted_at DESC
     LIMIT $1`,
    [limit]
  );
}

