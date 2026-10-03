import * as evaluationService from '../services/evaluation.service.js';
import { success } from '../utils/apiResponse.js';

export async function index(req, res, next) {
  try {
    return success(res, 'Évaluations récupérées.', await evaluationService.getEvaluations());
  } catch (err) {
    return next(err);
  }
}

