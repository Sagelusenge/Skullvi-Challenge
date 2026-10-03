import { getRanking } from '../services/ranking.service.js';
import { success } from '../utils/apiResponse.js';

export async function index(req, res, next) {
  try {
    return success(res, 'Classement récupéré.', await getRanking(req.query));
  } catch (err) {
    return next(err);
  }
}

