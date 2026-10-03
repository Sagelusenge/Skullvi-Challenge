import * as authService from '../services/auth.service.js';
import { success } from '../utils/apiResponse.js';

export async function login(req, res, next) {
  try {
    const session = await authService.login(req.body);
    return success(res, 'Connexion réussie.', session);
  } catch (err) {
    return next(err);
  }
}

export function me(req, res) {
  return success(res, 'Administrateur connecté.', authService.me(req.user));
}

export function logout(req, res) {
  return success(res, 'Déconnexion réussie.', null);
}

