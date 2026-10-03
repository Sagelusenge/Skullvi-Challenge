import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { failure } from '../utils/apiResponse.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return failure(res, 'Authentication required', 401);
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return failure(res, 'Invalid or expired token', 401);
  }
}

