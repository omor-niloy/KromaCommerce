"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const app_error_1 = require("../errors/app-error");
/**
 * Abstract Base Controller providing standardized HTTP response dispatching and error handling.
 */
class BaseController {
    /**
     * Dispatches a successful JSON response (default 200 OK).
     */
    sendSuccess(res, data, statusCode = 200, meta) {
        const responseBody = {
            success: true,
            data,
            ...(meta ? { meta } : {})
        };
        return res.status(statusCode).json(responseBody);
    }
    /**
     * Dispatches a 201 Created JSON response.
     */
    sendCreated(res, data, meta) {
        return this.sendSuccess(res, data, 201, meta);
    }
    /**
     * Dispatches a 200 OK paginated JSON response with metadata.
     */
    sendPaginated(res, data, meta) {
        const responseBody = {
            success: true,
            data,
            meta
        };
        return res.status(200).json(responseBody);
    }
    /**
     * Dispatches a 204 No Content response.
     */
    sendNoContent(res) {
        return res.status(204).send();
    }
    /**
     * Catches domain errors and dispatches standardized error JSON response.
     */
    handleError(res, error) {
        if (error instanceof app_error_1.AppError) {
            const responseBody = {
                success: false,
                error: error.serialize()
            };
            return res.status(error.statusCode).json(responseBody);
        }
        const message = error instanceof Error ? error.message : 'Internal server error';
        const responseBody = {
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message
            }
        };
        return res.status(500).json(responseBody);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map