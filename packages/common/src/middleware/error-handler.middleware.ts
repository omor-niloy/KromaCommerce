import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * Global Express error handling middleware class.
 */
export class ErrorHandlerMiddleware {
  /**
   * Catches errors in Express pipeline and formats standardized JSON response.
   */
  public static handle(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Response {
    if (err instanceof AppError) {
      const response: ApiResponse = {
        success: false,
        error: err.serialize()
      };
      return res.status(err.statusCode).json(response);
    }

    const message = err instanceof Error ? err.message : 'Internal Server Error';
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message
      }
    };
    return res.status(500).json(response);
  }
}
