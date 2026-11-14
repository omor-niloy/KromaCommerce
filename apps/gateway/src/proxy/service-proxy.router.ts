import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthApp } from '@ecommerce/auth-service';
import { CatalogApp } from '@ecommerce/catalog-service';
import { OrderApp } from '@ecommerce/order-service';
import { ScraperApp } from '@ecommerce/scraper-service';

export interface ServiceUrls {
  authServiceUrl: string;
  catalogServiceUrl: string;
  orderServiceUrl: string;
  scraperServiceUrl: string;
}

/**
 * Router managing API Gateway routing across downstream microservices.
 */
export class ServiceProxyRouter {
  private readonly router: Router;
  private readonly isConsolidated: boolean;
  private readonly urls: ServiceUrls;

  constructor(
    isConsolidated = process.env['CONSOLIDATED_MODE'] === 'true' || !process.env['AUTH_SERVICE_URL'],
    urls?: Partial<ServiceUrls>
  ) {
    this.router = Router();
    this.isConsolidated = isConsolidated;
    this.urls = {
      authServiceUrl: urls?.authServiceUrl || process.env['AUTH_SERVICE_URL'] || 'http://localhost:8001',
      catalogServiceUrl: urls?.catalogServiceUrl || process.env['CATALOG_SERVICE_URL'] || 'http://localhost:8002',
      orderServiceUrl: urls?.orderServiceUrl || process.env['ORDER_SERVICE_URL'] || 'http://localhost:8003',
      scraperServiceUrl: urls?.scraperServiceUrl || process.env['SCRAPER_SERVICE_URL'] || 'http://localhost:8004'
    };
    this.setupRoutes();
  }

  private setupRoutes(): void {
    if (this.isConsolidated) {
      this.setupConsolidatedRoutes();
    } else {
      this.setupDistributedProxyRoutes();
    }
  }

  private setupConsolidatedRoutes(): void {
    const authApp = new AuthApp();
    const catalogApp = new CatalogApp();
    const orderApp = new OrderApp();
    const scraperApp = new ScraperApp();

    this.router.use(authApp.app);
    this.router.use(catalogApp.app);
    this.router.use(orderApp.app);
    this.router.use(scraperApp.app);
  }

  private setupDistributedProxyRoutes(): void {
    this.router.use(
      '/api/v1/auth',
      createProxyMiddleware({
        target: this.urls.authServiceUrl,
        changeOrigin: true
      })
    );

    this.router.use(
      ['/api/v1/products', '/api/v1/categories'],
      createProxyMiddleware({
        target: this.urls.catalogServiceUrl,
        changeOrigin: true
      })
    );

    this.router.use(
      ['/api/v1/orders', '/api/v1/webhooks'],
      createProxyMiddleware({
        target: this.urls.orderServiceUrl,
        changeOrigin: true
      })
    );

    this.router.use(
      ['/api/v1/scraper', '/mock-competitor'],
      createProxyMiddleware({
        target: this.urls.scraperServiceUrl,
        changeOrigin: true
      })
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
