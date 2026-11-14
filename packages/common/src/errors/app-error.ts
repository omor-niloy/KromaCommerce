/**
 * Abstract domain error representing all expected application-level errors.
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly details?: unknown;

  /**
   * Initializes application error with message and optional details.
   */
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializes error into standardized response structure.
   */
  public serialize(): { code: string; message: string; details?: unknown } {
    return {
      code: this.errorCode,
      message: this.message,
      ...(this.details !== undefined ? { details: this.details } : {})
    };
  }
}
