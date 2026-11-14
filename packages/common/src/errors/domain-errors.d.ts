import { AppError } from './app-error';
/**
 * 400 Bad Request error.
 */
export declare class BadRequestError extends AppError {
    readonly statusCode = 400;
    readonly errorCode = "BAD_REQUEST";
    constructor(message?: string, details?: unknown);
}
/**
 * 401 Unauthorized error.
 */
export declare class UnauthorizedError extends AppError {
    readonly statusCode = 401;
    readonly errorCode = "UNAUTHORIZED";
    constructor(message?: string, details?: unknown);
}
/**
 * 403 Forbidden error.
 */
export declare class ForbiddenError extends AppError {
    readonly statusCode = 403;
    readonly errorCode = "FORBIDDEN";
    constructor(message?: string, details?: unknown);
}
/**
 * 404 Not Found error.
 */
export declare class NotFoundError extends AppError {
    readonly statusCode = 404;
    readonly errorCode = "NOT_FOUND";
    constructor(message?: string, details?: unknown);
}
/**
 * 409 Conflict error.
 */
export declare class ConflictError extends AppError {
    readonly statusCode = 409;
    readonly errorCode = "CONFLICT";
    constructor(message?: string, details?: unknown);
}
/**
 * 422 Unprocessable Entity / Validation error.
 */
export declare class ValidationError extends AppError {
    readonly statusCode = 422;
    readonly errorCode = "VALIDATION_FAILED";
    constructor(message?: string, details?: unknown);
}
/**
 * 500 Internal Server Error.
 */
export declare class InternalServerError extends AppError {
    readonly statusCode = 500;
    readonly errorCode = "INTERNAL_SERVER_ERROR";
    constructor(message?: string, details?: unknown);
}
//# sourceMappingURL=domain-errors.d.ts.map