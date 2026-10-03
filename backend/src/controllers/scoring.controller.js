import * as scoringService from '../services/scoring.service.js';
import { success } from '../utils/apiResponse.js';

export async function criteria(req, res, next) {
  try {
    return success(res, 'Critères de scoring récupérés.', await scoringService.getCriteria());
  } catch (err) {
    return next(err);
  }
}

export async function updateCriteria(req, res, next) {
  try {
    return success(res, 'Critères de scoring mis à jour.', await scoringService.changeCriteria(req.body.criteria));
  } catch (err) {
    return next(err);
  }
}

export async function recalculateAll(req, res, next) {
  try {
    return success(res, 'Recalcul lancé.', await scoringService.recalculateAllScores(req.user.id));
  } catch (err) {
    return next(err);
  }
}

