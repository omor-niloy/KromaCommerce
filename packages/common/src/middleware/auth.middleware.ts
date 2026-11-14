import { Request, Response, NextFunction } from 'express';
import { JwtTokenManager } from '../security/jwt-token-manager';
import { TokenPayload, UserRole } from '../interfaces/auth.interface';
import { UnauthorizedError, ForbiddenError } from '../errors/domain-errors';

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
export class AuthMiddleware {
  private readonly tokenManager: JwtTokenManager;

  constructor(tokenManager: JwtTokenManager = new JwtTokenManager()) {
    this.tokenManager = tokenManager;
  }

  /**
   * Middleware requiring a valid Bearer JWT access token.
   */
  public authenticate() {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next(new UnauthorizedError('Missing or malformed Authorization header'));
        return;
      }

      const token = authHeader.substring(7);
      try {
        const payload = this.tokenManager.verifyAccessToken(token);
        req.user = payload;
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  /**
   * Middleware requiring the authenticated user to possess a specific role.
   */
  public requireRole(...roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      if (!req.user) {
        next(new UnauthorizedError('Authentication required'));
        return;
      }

      if (!roles.includes(req.user.role)) {
        next(new ForbiddenError(`Forbidden: requires one of [${roles.join(', ')}] roles`));
        return;
      }

      next();
    };
  }
}
