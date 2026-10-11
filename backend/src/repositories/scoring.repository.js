import { execute } from '../config/database.js';

export async function listCriteria(activeOnly = false, connection = null) {
  return execute(
    `SELECT id, criterion_key, criterion_name, weight, max_score, is_active AS "isActive",
      created_at AS "createdAt", updated_at AS "updatedAt"
     FROM scoring_criteria
     ${activeOnly ? 'WHERE is_active = TRUE' : ''}
     ORDER BY id ASC`,
    [],
    connection
  );
}

export async function getActiveCriteria(connection = null) {
  return listCriteria(true, connection);
}

export async function updateCriteria(criteria, connection = null) {
  for (const criterion of criteria) await execute(
    `UPDATE scoring_criteria
     SET weight = $1, max_score = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
     WHERE criterion_key = $4`,
    [
      criterion.weight,
      criterion.maxScore ?? criterion.max_score ?? criterion.weight,
      criterion.isActive ?? criterion.is_active ?? true,
      criterion.criterionKey ?? criterion.criterion_key
    ],
    connection
  );

  return listCriteria(false, connection);
}

