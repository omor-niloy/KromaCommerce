"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Abstract domain error representing all expected application-level errors.
 */
class AppError extends Error {
    details;
    /**
     * Initializes application error with message and optional details.
     */
    constructor(message, details) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Serializes error into standardized response structure.
     */
    serialize() {
        return {
            code: this.errorCode,
            message: this.message,
            ...(this.details !== undefined ? { details: this.details } : {})
        };
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map