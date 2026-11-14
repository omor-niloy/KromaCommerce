/**
 * Abstract domain error representing all expected application-level errors.
 */
export declare abstract class AppError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: string;
    readonly details?: unknown;
    /**
     * Initializes application error with message and optional details.
     */
    constructor(message: string, details?: unknown);
    /**
     * Serializes error into standardized response structure.
     */
    serialize(): {
        code: string;
        message: string;
        details?: unknown;
    };
}
//# sourceMappingURL=app-error.d.ts.map