import express, { Application } from 'express';
import cors from 'cors';
import { ErrorHandlerMiddleware } from '@ecommerce/common';
import { DatabaseConnection } from '@ecommerce/database';
import { ProductRepository, CategoryRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { CatalogRouter } from './routes/product.routes';

/**
 * Express Application setup class for Catalog microservice.
 */
export class CatalogApp {
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
    const productRepo = new ProductRepository(prisma);
    const categoryRepo = new CategoryRepository(prisma);
    const productService = new ProductService(productRepo, categoryRepo);
    const productController = new ProductController(productService);
    const catalogRouter = new CatalogRouter(productController);

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', service: 'catalog-service' });
    });

    this.app.use('/api/v1', catalogRouter.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }
}
