"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jwt_token_manager_1 = require("../security/jwt-token-manager");
const domain_errors_1 = require("../errors/domain-errors");
/**
 * Middleware handler enforcing JWT authentication and role authorization.
 */
class AuthMiddleware {
    tokenManager;
    constructor(tokenManager = new jwt_token_manager_1.JwtTokenManager()) {
        this.tokenManager = tokenManager;
    }
    /**
     * Middleware requiring a valid Bearer JWT access token.
     */
    authenticate() {
        return (req, _res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                next(new domain_errors_1.UnauthorizedError('Missing or malformed Authorization header'));
                return;
            }
            const token = authHeader.substring(7);
            try {
                const payload = this.tokenManager.verifyAccessToken(token);
                req.user = payload;
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
    /**
     * Middleware requiring the authenticated user to possess a specific role.
     */
    requireRole(...roles) {
        return (req, _res, next) => {
            if (!req.user) {
                next(new domain_errors_1.UnauthorizedError('Authentication required'));
                return;
            }
            if (!roles.includes(req.user.role)) {
                next(new domain_errors_1.ForbiddenError(`Forbidden: requires one of [${roles.join(', ')}] roles`));
                return;
            }
            next();
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map