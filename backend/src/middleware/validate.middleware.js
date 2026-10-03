import { failure } from '../utils/apiResponse.js';

function formatZodErrors(error) {
  return error.errors.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message
  }));
}

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return failure(res, 'Validation failed', 422, formatZodErrors(result.error));
    }

    req[source] = result.data;
    return next();
  };
}

