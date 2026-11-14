import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Server } from 'http';
import { ScraperApp } from '@ecommerce/scraper-service';
import { DatabaseConnection } from '@ecommerce/database';
import { JwtTokenManager } from '@ecommerce/common';

/**
 * Acceptance test suite verifying Scraper & Price Intelligence endpoints and RBAC.
 */
describe('Scraper Acceptance Tests', () => {
  let scraperApp: ScraperApp;
  let httpServer: Server;
  let tokenManager: JwtTokenManager;
  let adminToken: string;
  let customerToken: string;
  let testProductId: string;

  beforeAll(async () => {
    scraperApp = new ScraperApp();
    tokenManager = new JwtTokenManager();
    const prisma = DatabaseConnection.getInstance();

    // Start server on port 8004 so headless Playwright can navigate to mock-competitor URLs
    httpServer = scraperApp.app.listen(8004);

    adminToken = tokenManager.generateAccessToken({
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@kromacommerce.com',
      role: 'ADMIN'
    });

    customerToken = tokenManager.generateAccessToken({
      userId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'customer@kromacommerce.com',
      role: 'CUSTOMER'
    });

    const product = await prisma.product.findFirst({
      where: { slug: 'kroma-noise-cancelling-headphones' }
    });

    if (!product) {
      throw new Error('Seed product not found for price comparison');
    }
    testProductId = product.id;
  });

  afterAll(async () => {
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    }
  });

  describe('GET /mock-competitor/products/:item', () => {
    it('should render HTML page containing competitor price and store selectors', async () => {
      const response = await request(scraperApp.app).get('/mock-competitor/products/headphones');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('data-testid="product-price"');
      expect(response.text).toContain('data-testid="product-title"');
      expect(response.text).toContain('data-testid="store-name"');
      expect(response.text).toContain('$229.99');
      expect(response.text).toContain('ElectroStore Express');
    });

    it('should render fallback details for generic item query', async () => {
      const response = await request(scraperApp.app).get('/mock-competitor/products/keyboard');

      expect(response.status).toBe(200);
      expect(response.text).toContain('data-testid="product-price"');
      expect(response.text).toContain('$149.99');
    });
  });

  describe('GET /api/v1/scraper/compare/:productId', () => {
    it('should return price comparison summary with records', async () => {
      const response = await request(scraperApp.app).get(`/api/v1/scraper/compare/${testProductId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const comparison = response.body.data;
      expect(comparison.productId).toBe(testProductId);
      expect(typeof comparison.ourPrice).toBe('number');
      expect(typeof comparison.lowestCompetitorPrice).toBe('number');
      expect(typeof comparison.differencePercentage).toBe('number');
      expect(Array.isArray(comparison.records)).toBe(true);
      expect(comparison.records.length).toBeGreaterThan(0);
      expect(comparison.records[0]).toHaveProperty('competitorName');
      expect(comparison.records[0]).toHaveProperty('price');
    });

    it('should return 404 Not Found for non-existent product ID', async () => {
      const response = await request(scraperApp.app).get('/api/v1/scraper/compare/550e8400-e29b-41d4-a716-446655440999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/scraper/sync RBAC & Execution', () => {
    it('should reject synchronization request without authentication', async () => {
      const response = await request(scraperApp.app)
        .post('/api/v1/scraper/sync')
        .send({ limit: 1 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject synchronization request from CUSTOMER role', async () => {
      const response = await request(scraperApp.app)
        .post('/api/v1/scraper/sync')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ limit: 1 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should permit ADMIN role to crawl and sync competitor prices via Playwright', async () => {
      const response = await request(scraperApp.app)
        .post(`/api/v1/scraper/sync/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('productId', testProductId);
      expect(response.body.data).toHaveProperty('competitorPrice');
      expect(response.body.data.competitorPrice).toBe(229.99);
      expect(response.body.data.competitorName).toBe('ElectroStore Express');
    }, 25000);
  });
});
