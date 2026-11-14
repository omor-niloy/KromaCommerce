import { AppError } from './app-error';

/**
 * 400 Bad Request error.
 */
export class BadRequestError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'BAD_REQUEST';

  constructor(message = 'Bad Request', details?: unknown) {
    super(message, details);
  }
}

/**
 * 401 Unauthorized error.
 */
export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'UNAUTHORIZED';

  constructor(message = 'Unauthorized access', details?: unknown) {
    super(message, details);
  }
}

/**
 * 403 Forbidden error.
 */
export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'FORBIDDEN';

  constructor(message = 'Access forbidden', details?: unknown) {
    super(message, details);
  }
}

/**
 * 404 Not Found error.
 */
export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'NOT_FOUND';

  constructor(message = 'Resource not found', details?: unknown) {
    super(message, details);
  }
}

/**
 * 409 Conflict error.
 */
export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'CONFLICT';

  constructor(message = 'Resource conflict', details?: unknown) {
    super(message, details);
  }
}

/**
 * 422 Unprocessable Entity / Validation error.
 */
export class ValidationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'VALIDATION_FAILED';

  constructor(message = 'Validation failed', details?: unknown) {
    super(message, details);
  }
}

/**
 * 500 Internal Server Error.
 */
export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = 'INTERNAL_SERVER_ERROR';

  constructor(message = 'Internal server error', details?: unknown) {
    super(message, details);
  }
}
