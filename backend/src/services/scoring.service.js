import { transaction } from '../config/database.js';
import { listCriteria, updateCriteria } from '../repositories/scoring.repository.js';
import { AppError } from '../utils/apiResponse.js';
import { recalculateAutomaticScore } from './candidate.service.js';

export async function getCriteria() {
  return listCriteria();
}

export async function changeCriteria(criteria) {
  const activeWeight = criteria
    .filter((criterion) => criterion.isActive ?? criterion.is_active ?? true)
    .reduce((sum, criterion) => sum + Number(criterion.weight), 0);

  if (activeWeight !== 100) {
    throw new AppError('The total weight of active criteria must be exactly 100.', 400);
  }

  return transaction((connection) => updateCriteria(criteria, connection));
}

export async function recalculateAllScores() {
  throw new AppError(
    'Bulk recalculation is intentionally not automatic in this mini-challenge. Use candidate recalculation for explicit updates.',
    400
  );
}

export { recalculateAutomaticScore };

