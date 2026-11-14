import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

/**
 * Middleware provider configuring sliding-window rate limiters.
 */
export class RateLimiterMiddleware {
  /**
   * Creates standard global rate limiter for general API routes.
   */
  public static createGlobalLimiter(): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests from this IP, please try again after 15 minutes.'
        }
      }
    });
  }

  /**
   * Creates strict rate limiter for authentication endpoints to prevent credential stuffing.
   */
  public static createAuthLimiter(): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 30,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many login or registration attempts. Please try again after 15 minutes.'
        }
      }
    });
  }
}
