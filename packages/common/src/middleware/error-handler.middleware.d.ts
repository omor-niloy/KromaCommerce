import { Request, Response, NextFunction } from 'express';
/**
 * Global Express error handling middleware class.
 */
export declare class ErrorHandlerMiddleware {
    /**
     * Catches errors in Express pipeline and formats standardized JSON response.
     */
    static handle(err: unknown, _req: Request, res: Response, _next: NextFunction): Response;
}
//# sourceMappingURL=error-handler.middleware.d.ts.map