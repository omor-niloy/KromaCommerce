import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/domain-errors';

/**
 * Middleware handler encapsulating Zod request validation.
 */
export class ValidationMiddleware {
  /**
   * Generates middleware validating request body against provided Zod schema.
   */
  public static validateBody(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }));
          next(new ValidationError('Request body validation failed', formatted));
          return;
        }
        next(error);
      }
    };
  }

  /**
   * Generates middleware validating query parameters against provided Zod schema.
   */
  public static validateQuery(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        req.query = schema.parse(req.query);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formatted = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }));
          next(new ValidationError('Query parameters validation failed', formatted));
          return;
        }
        next(error);
      }
    };
  }
}
