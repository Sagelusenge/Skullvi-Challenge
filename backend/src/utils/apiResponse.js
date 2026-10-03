export function success(res, message, data = null, status = 200, meta = undefined) {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {})
  });
}

export function created(res, message, data = null) {
  return success(res, message, data, 201);
}

export function failure(res, message, status = 400, errors = []) {
  return res.status(status).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors].filter(Boolean)
  });
}

export class AppError extends Error {
  constructor(message, status = 500, errors = []) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errors = errors;
  }
}

