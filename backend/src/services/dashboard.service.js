import { execute } from '../config/database.js';

export async function getStats() {
  const rows = await execute(
    `SELECT
      COUNT(*) AS totalCandidates,
      COALESCE(SUM(status = 'new'), 0) AS newCandidates,
      COALESCE(SUM(status = 'to_review'), 0) AS toReview,
      COALESCE(SUM(status = 'shortlisted'), 0) AS shortlisted,
      COALESCE(SUM(status = 'selected'), 0) AS selected,
      ROUND(AVG(automatic_score), 2) AS averageAutomaticScore,
      ROUND(AVG(final_score), 2) AS averageFinalScore
     FROM candidates`
  );

  return rows[0];
}

export async function getRecentCandidates(limit = 10) {
  return execute(
    `SELECT id AS candidateId, application_reference AS applicationReference,
      CONCAT(first_name, ' ', last_name) AS fullName, email, domain, status,
      automatic_score AS automaticScore, final_score AS finalScore, qualification,
      submitted_at AS submittedAt
     FROM candidates
     ORDER BY submitted_at DESC
     LIMIT ?`,
    [limit]
  );
}

