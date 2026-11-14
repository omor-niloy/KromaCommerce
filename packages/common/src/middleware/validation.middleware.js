"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const zod_1 = require("zod");
const domain_errors_1 = require("../errors/domain-errors");
/**
 * Middleware handler encapsulating Zod request validation.
 */
class ValidationMiddleware {
    /**
     * Generates middleware validating request body against provided Zod schema.
     */
    static validateBody(schema) {
        return (req, _res, next) => {
            try {
                req.body = schema.parse(req.body);
                next();
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    const formatted = error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }));
                    next(new domain_errors_1.ValidationError('Request body validation failed', formatted));
                    return;
                }
                next(error);
            }
        };
    }
    /**
     * Generates middleware validating query parameters against provided Zod schema.
     */
    static validateQuery(schema) {
        return (req, _res, next) => {
            try {
                req.query = schema.parse(req.query);
                next();
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    const formatted = error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }));
                    next(new domain_errors_1.ValidationError('Query parameters validation failed', formatted));
                    return;
                }
                next(error);
            }
        };
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
//# sourceMappingURL=validation.middleware.js.map