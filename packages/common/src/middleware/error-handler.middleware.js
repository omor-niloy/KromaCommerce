"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
const app_error_1 = require("../errors/app-error");
/**
 * Global Express error handling middleware class.
 */
class ErrorHandlerMiddleware {
    /**
     * Catches errors in Express pipeline and formats standardized JSON response.
     */
    static handle(err, _req, res, _next) {
        if (err instanceof app_error_1.AppError) {
            const response = {
                success: false,
                error: err.serialize()
            };
            return res.status(err.statusCode).json(response);
        }
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        const response = {
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message
            }
        };
        return res.status(500).json(response);
    }
}
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
//# sourceMappingURL=error-handler.middleware.js.map