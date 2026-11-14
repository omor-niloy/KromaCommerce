"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const app_error_1 = require("./app-error");
/**
 * 400 Bad Request error.
 */
class BadRequestError extends app_error_1.AppError {
    statusCode = 400;
    errorCode = 'BAD_REQUEST';
    constructor(message = 'Bad Request', details) {
        super(message, details);
    }
}
exports.BadRequestError = BadRequestError;
/**
 * 401 Unauthorized error.
 */
class UnauthorizedError extends app_error_1.AppError {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    constructor(message = 'Unauthorized access', details) {
        super(message, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * 403 Forbidden error.
 */
class ForbiddenError extends app_error_1.AppError {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    constructor(message = 'Access forbidden', details) {
        super(message, details);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * 404 Not Found error.
 */
class NotFoundError extends app_error_1.AppError {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    constructor(message = 'Resource not found', details) {
        super(message, details);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * 409 Conflict error.
 */
class ConflictError extends app_error_1.AppError {
    statusCode = 409;
    errorCode = 'CONFLICT';
    constructor(message = 'Resource conflict', details) {
        super(message, details);
    }
}
exports.ConflictError = ConflictError;
/**
 * 422 Unprocessable Entity / Validation error.
 */
class ValidationError extends app_error_1.AppError {
    statusCode = 422;
    errorCode = 'VALIDATION_FAILED';
    constructor(message = 'Validation failed', details) {
        super(message, details);
    }
}
exports.ValidationError = ValidationError;
/**
 * 500 Internal Server Error.
 */
class InternalServerError extends app_error_1.AppError {
    statusCode = 500;
    errorCode = 'INTERNAL_SERVER_ERROR';
    constructor(message = 'Internal server error', details) {
        super(message, details);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=domain-errors.js.map