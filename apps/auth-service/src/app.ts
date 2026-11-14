import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ErrorHandlerMiddleware } from '@ecommerce/common';
import { DatabaseConnection } from '@ecommerce/database';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRouter } from './routes/auth.routes';

/**
 * Express Application setup class for Auth microservice.
 */
export class AuthApp {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    const allowedOrigins = (process.env['FRONTEND_URL'] || 'http://localhost:3000')
      .split(',')
      .map((url) => url.trim().replace(/\/$/, ''))
      .filter(Boolean);

    this.app.use(cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:') ||
          origin.endsWith('.vercel.app')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    }));
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private setupRoutes(): void {
    const prisma = DatabaseConnection.getInstance();
    const userRepo = new UserRepository(prisma);
    const authService = new AuthService(userRepo);
    const authController = new AuthController(authService);
    const authRouter = new AuthRouter(authController);

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', service: 'auth-service' });
    });

    this.app.use('/api/v1/auth', authRouter.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }
}
