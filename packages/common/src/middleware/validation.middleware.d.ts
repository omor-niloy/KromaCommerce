import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Middleware handler encapsulating Zod request validation.
 */
export declare class ValidationMiddleware {
    /**
     * Generates middleware validating request body against provided Zod schema.
     */
    static validateBody(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
    /**
     * Generates middleware validating query parameters against provided Zod schema.
     */
    static validateQuery(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=validation.middleware.d.ts.map