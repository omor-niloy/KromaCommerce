import { Request, Response, NextFunction } from 'express';
import { JwtTokenManager } from '../security/jwt-token-manager';
import { TokenPayload, UserRole } from '../interfaces/auth.interface';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
/**
 * Middleware handler enforcing JWT authentication and role authorization.
 */
export declare class AuthMiddleware {
    private readonly tokenManager;
    constructor(tokenManager?: JwtTokenManager);
    /**
     * Middleware requiring a valid Bearer JWT access token.
     */
    authenticate(): (req: Request, _res: Response, next: NextFunction) => void;
    /**
     * Middleware requiring the authenticated user to possess a specific role.
     */
    requireRole(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.middleware.d.ts.map