import express, { Application } from 'express';
import cors from 'cors';
import { ErrorHandlerMiddleware } from '@ecommerce/common';
import { DatabaseConnection } from '@ecommerce/database';
import { ScraperRepository } from './repositories/scraper.repository';
import { ScraperService } from './services/scraper.service';
import { ScraperController } from './controllers/scraper.controller';
import { ScraperRouter } from './routes/scraper.routes';

/**
 * Express Application setup class for Scraper & Price Intelligence microservice.
 */
export class ScraperApp {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
      credentials: true
    }));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const prisma = DatabaseConnection.getInstance();
    const scraperRepo = new ScraperRepository(prisma);
    const scraperService = new ScraperService(scraperRepo, prisma);
    const scraperController = new ScraperController(scraperService);
    const scraperRouter = new ScraperRouter(scraperController);

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', service: 'scraper-service' });
    });

    this.app.use('/', scraperRouter.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }
}
