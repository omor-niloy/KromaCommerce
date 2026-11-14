import { Response } from 'express';
/**
 * Abstract Base Controller providing standardized HTTP response dispatching and error handling.
 */
export declare abstract class BaseController {
    /**
     * Dispatches a successful JSON response (default 200 OK).
     */
    protected sendSuccess<T>(res: Response, data: T, statusCode?: number, meta?: Record<string, unknown>): Response;
    /**
     * Dispatches a 201 Created JSON response.
     */
    protected sendCreated<T>(res: Response, data: T, meta?: Record<string, unknown>): Response;
    /**
     * Dispatches a 200 OK paginated JSON response with metadata.
     */
    protected sendPaginated<T>(res: Response, data: T[], meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }): Response;
    /**
     * Dispatches a 204 No Content response.
     */
    protected sendNoContent(res: Response): Response;
    /**
     * Catches domain errors and dispatches standardized error JSON response.
     */
    protected handleError(res: Response, error: unknown): Response;
}
//# sourceMappingURL=base.controller.d.ts.map