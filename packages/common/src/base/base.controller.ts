import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';
import { AppError } from '../errors/app-error';

/**
 * Abstract Base Controller providing standardized HTTP response dispatching and error handling.
 */
export abstract class BaseController {
  /**
   * Dispatches a successful JSON response (default 200 OK).
   */
  protected sendSuccess<T>(
    res: Response,
    data: T,
    statusCode = 200,
    meta?: Record<string, unknown>
  ): Response {
    const responseBody: ApiResponse<T> = {
      success: true,
      data,
      ...(meta ? { meta } : {})
    };
    return res.status(statusCode).json(responseBody);
  }

  /**
   * Dispatches a 201 Created JSON response.
   */
  protected sendCreated<T>(
    res: Response,
    data: T,
    meta?: Record<string, unknown>
  ): Response {
    return this.sendSuccess(res, data, 201, meta);
  }

  /**
   * Dispatches a 200 OK paginated JSON response with metadata.
   */
  protected sendPaginated<T>(
    res: Response,
    data: T[],
    meta: { page: number; limit: number; total: number; totalPages: number }
  ): Response {
    const responseBody: ApiResponse<T[]> = {
      success: true,
      data,
      meta
    };
    return res.status(200).json(responseBody);
  }

  /**
   * Dispatches a 204 No Content response.
   */
  protected sendNoContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Catches domain errors and dispatches standardized error JSON response.
   */
  protected handleError(res: Response, error: unknown): Response {
    if (error instanceof AppError) {
      const responseBody: ApiResponse = {
        success: false,
        error: error.serialize()
      };
      return res.status(error.statusCode).json(responseBody);
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    const responseBody: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message
      }
    };
    return res.status(500).json(responseBody);
  }
}
