import { Router } from 'express';
import { AuthMiddleware } from '@ecommerce/common';
import { ScraperController } from '../controllers/scraper.controller';

/**
 * Express router builder for price intelligence scraper endpoints.
 */
export class ScraperRouter {
  private readonly router: Router;
  private readonly controller: ScraperController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(
    controller: ScraperController,
    authMiddleware: AuthMiddleware = new AuthMiddleware()
  ) {
    this.router = Router();
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/mock-competitor/products/:item', this.controller.renderMockCompetitorPage);

    this.router.get('/api/v1/scraper/compare/:productId', this.controller.getComparison);

    this.router.post(
      '/api/v1/scraper/sync',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      this.controller.syncAll
    );

    this.router.post(
      '/api/v1/scraper/sync/:productId',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      this.controller.syncProduct
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
