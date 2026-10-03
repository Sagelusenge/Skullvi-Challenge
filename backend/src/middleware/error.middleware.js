import { failure } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return failure(res, `Route not found: ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return failure(res, message, status, err.errors || []);
}

