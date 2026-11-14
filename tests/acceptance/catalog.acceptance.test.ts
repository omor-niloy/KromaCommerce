import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { CatalogApp } from '@ecommerce/catalog-service';
import { JwtTokenManager } from '@ecommerce/common';

/**
 * Acceptance test suite verifying Catalog & Products microservice HTTP endpoints and RBAC.
 */
describe('Catalog Acceptance Tests', () => {
  let catalogApp: CatalogApp;
  let tokenManager: JwtTokenManager;
  let adminToken: string;
  let customerToken: string;
  let sampleCategoryId: string;
  let createdProductId: string;

  beforeAll(async () => {
    catalogApp = new CatalogApp();
    tokenManager = new JwtTokenManager();

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

    const categoryRes = await request(catalogApp.app).get('/api/v1/categories');
    expect(categoryRes.status).toBe(200);
    expect(Array.isArray(categoryRes.body.data)).toBe(true);
    expect(categoryRes.body.data.length).toBeGreaterThan(0);
    sampleCategoryId = categoryRes.body.data[0].id;
  });

  describe('GET /api/v1/categories', () => {
    it('should return a list of seeded product categories', async () => {
      const response = await request(catalogApp.app).get('/api/v1/categories');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('slug');
      expect(response.body.data[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/v1/products', () => {
    it('should return paginated products with metadata', async () => {
      const response = await request(catalogApp.app)
        .get('/api/v1/products')
        .query({ page: 1, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(5);
      expect(typeof response.body.meta.total).toBe('number');
      expect(typeof response.body.meta.totalPages).toBe('number');
    });

    it('should filter products by category slug', async () => {
      const response = await request(catalogApp.app)
        .get('/api/v1/products')
        .query({ categorySlug: 'audio' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      for (const item of response.body.data) {
        expect(item.category.slug).toBe('audio');
      }
    });

    it('should filter products by search keyword', async () => {
      const response = await request(catalogApp.app)
        .get('/api/v1/products')
        .query({ search: 'Headphones' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name.toLowerCase()).toContain('headphones');
    });

    it('should filter products within minPrice and maxPrice range', async () => {
      const response = await request(catalogApp.app)
        .get('/api/v1/products')
        .query({ minPrice: 150, maxPrice: 250 });

      expect(response.status).toBe(200);
      for (const item of response.body.data) {
        expect(item.price).toBeGreaterThanOrEqual(150);
        expect(item.price).toBeLessThanOrEqual(250);
      }
    });
  });

  describe('GET /api/v1/products/:idOrSlug', () => {
    it('should retrieve a product by slug', async () => {
      const response = await request(catalogApp.app)
        .get('/api/v1/products/kroma-noise-cancelling-headphones');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('kroma-noise-cancelling-headphones');
      expect(response.body.data).toHaveProperty('price');
      expect(response.body.data).toHaveProperty('competitorPriceRecords');
    });

    it('should retrieve a product by UUID', async () => {
      const listRes = await request(catalogApp.app).get('/api/v1/products?limit=1');
      const productId = listRes.body.data[0].id;

      const response = await request(catalogApp.app).get(`/api/v1/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productId);
    });

    it('should return 404 Not Found for non-existent product identifier', async () => {
      const response = await request(catalogApp.app).get('/api/v1/products/non-existent-product-slug-xyz');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('RBAC Product Creation, Update, and Deletion', () => {
    const timestamp = Date.now();
    const newProductSlug = `rbac-test-item-${timestamp}`;
    const newProductPayload = {
      name: `RBAC Test Product ${timestamp}`,
      slug: newProductSlug,
      description: 'Comprehensive RBAC test product item.',
      price: 99.99,
      inventoryCount: 25,
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d',
      categoryId: '',
      competitorUrl: 'http://localhost:8004/mock-competitor/products/speaker'
    };

    beforeAll(() => {
      newProductPayload.categoryId = sampleCategoryId;
    });

    it('should return 401 Unauthorized when creating product without authentication', async () => {
      const response = await request(catalogApp.app)
        .post('/api/v1/products')
        .send(newProductPayload);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 403 Forbidden when creating product with CUSTOMER role token', async () => {
      const response = await request(catalogApp.app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(newProductPayload);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 201 Created when creating product with ADMIN role token', async () => {
      const response = await request(catalogApp.app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProductPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.slug).toBe(newProductSlug);
      createdProductId = response.body.data.id;
    });

    it('should return 403 Forbidden when customer attempts to update product', async () => {
      const response = await request(catalogApp.app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ price: 109.99 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 200 OK when admin updates product price and inventory', async () => {
      const response = await request(catalogApp.app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 119.99, inventoryCount: 50 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(119.99);
      expect(response.body.data.inventoryCount).toBe(50);
    });

    it('should return 403 Forbidden when customer attempts to delete product', async () => {
      const response = await request(catalogApp.app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 204 No Content when admin deletes product', async () => {
      const response = await request(catalogApp.app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      const verifyDeleted = await request(catalogApp.app).get(`/api/v1/products/${createdProductId}`);
      expect(verifyDeleted.status).toBe(404);
    });
  });
});
