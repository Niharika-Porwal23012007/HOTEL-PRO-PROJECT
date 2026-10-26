import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace req properties with parsed & sanitized versions
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return sendError(res, 400, 'Validation failed', formattedErrors);
    }
    return sendError(res, 400, 'Validation error');
  }
};
