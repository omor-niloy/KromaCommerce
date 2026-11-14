import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorHandlerMiddleware } from '@ecommerce/common';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { ServiceProxyRouter } from './proxy/service-proxy.router';

/**
 * Express Application setup class for API Gateway.
 */
export class GatewayApp {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.setupSecurityMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupSecurityMiddleware(): void {
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'http:']
        }
      },
      crossOriginEmbedderPolicy: false
    }));

    const allowedOrigin = process.env['FRONTEND_URL'] || 'http://localhost:3000';
    this.app.use(cors({
      origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
    }));

    this.app.use(cookieParser());
    this.app.use(RateLimiterMiddleware.createGlobalLimiter());
    this.app.use('/api/v1/auth/login', RateLimiterMiddleware.createAuthLimiter());
    this.app.use('/api/v1/auth/register', RateLimiterMiddleware.createAuthLimiter());
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'api-gateway',
        mode: process.env['CONSOLIDATED_MODE'] === 'false' ? 'distributed' : 'consolidated',
        timestamp: new Date().toISOString()
      });
    });

    const proxyRouter = new ServiceProxyRouter();
    this.app.use(proxyRouter.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }
}
