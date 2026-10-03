import * as dashboardService from '../services/dashboard.service.js';
import { success } from '../utils/apiResponse.js';

export async function stats(req, res, next) {
  try {
    return success(res, 'Statistiques récupérées.', await dashboardService.getStats());
  } catch (err) {
    return next(err);
  }
}

export async function recentCandidates(req, res, next) {
  try {
    const limit = Number(req.query.limit || 10);
    return success(res, 'Candidatures récentes récupérées.', await dashboardService.getRecentCandidates(limit));
  } catch (err) {
    return next(err);
  }
}

