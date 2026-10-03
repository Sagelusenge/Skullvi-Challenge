import { execute } from '../config/database.js';

export async function listCriteria(activeOnly = false, connection = null) {
  return execute(
    `SELECT id, criterion_key, criterion_name, weight, max_score, is_active AS isActive,
      created_at AS createdAt, updated_at AS updatedAt
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
  await Promise.all(criteria.map((criterion) => execute(
    `UPDATE scoring_criteria
     SET weight = ?, max_score = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE criterion_key = ?`,
    [
      criterion.weight,
      criterion.maxScore ?? criterion.max_score ?? criterion.weight,
      criterion.isActive ?? criterion.is_active ?? true,
      criterion.criterionKey ?? criterion.criterion_key
    ],
    connection
  )));

  return listCriteria(false, connection);
}

