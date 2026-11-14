import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { OrderApp } from '@ecommerce/order-service';
import { DatabaseConnection } from '@ecommerce/database';
import { JwtTokenManager } from '@ecommerce/common';

/**
 * Acceptance test suite verifying Order lifecycle, Checkout sessions, and Webhook fulfillment.
 */
describe('Order Acceptance Tests', () => {
  let orderApp: OrderApp;
  let tokenManager: JwtTokenManager;
  let customerUser: { id: string; email: string };
  let otherCustomerUser: { id: string; email: string };
  let customerToken: string;
  let otherCustomerToken: string;
  let testProduct: { id: string; price: number; name: string };
  let createdOrderId: string;

  beforeAll(async () => {
    orderApp = new OrderApp();
    tokenManager = new JwtTokenManager();
    const prisma = DatabaseConnection.getInstance();

    const seededUser = await prisma.user.findUnique({
      where: { email: 'customer@kromacommerce.com' }
    });

    if (!seededUser) {
      throw new Error('Seed customer user not found in database');
    }
    customerUser = { id: seededUser.id, email: seededUser.email };

    // Create another user to verify isolation and 403 checks
    const otherUser = await prisma.user.upsert({
      where: { email: 'other.customer@kromacommerce.test' },
      update: {},
      create: {
        email: 'other.customer@kromacommerce.test',
        name: 'Other Customer',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',
        role: 'CUSTOMER'
      }
    });
    otherCustomerUser = { id: otherUser.id, email: otherUser.email };

    customerToken = tokenManager.generateAccessToken({
      userId: customerUser.id,
      email: customerUser.email,
      role: 'CUSTOMER'
    });

    otherCustomerToken = tokenManager.generateAccessToken({
      userId: otherCustomerUser.id,
      email: otherCustomerUser.email,
      role: 'CUSTOMER'
    });

    const product = await prisma.product.findFirst({
      where: { slug: 'kroma-noise-cancelling-headphones' }
    });

    if (!product) {
      throw new Error('Seed product not found in database');
    }
    testProduct = { id: product.id, price: product.price, name: product.name };
  });

  describe('POST /api/v1/orders', () => {
    it('should reject unauthenticated order creation attempts with 401 Unauthorized', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders')
        .send({
          items: [{ productId: testProduct.id, quantity: 1 }]
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject order creation if product ID does not exist', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ productId: '550e8400-e29b-41d4-a716-446655440999', quantity: 1 }]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject order creation if requested quantity exceeds available stock', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ productId: testProduct.id, quantity: 99999 }]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Insufficient stock');
    });

    it('should successfully create a PENDING order with line items and accurate pricing', async () => {
      const quantity = 2;
      const response = await request(orderApp.app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ productId: testProduct.id, quantity }]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      const order = response.body.data;
      expect(order).toHaveProperty('id');
      expect(order.userId).toBe(customerUser.id);
      expect(order.status).toBe('PENDING');
      expect(order.totalAmount).toBe(Math.round(testProduct.price * quantity * 100) / 100);
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.items.length).toBe(1);
      expect(order.items[0].productId).toBe(testProduct.id);
      expect(order.items[0].quantity).toBe(quantity);

      createdOrderId = order.id;
    });
  });

  describe('POST /api/v1/orders/checkout', () => {
    it('should reject checkout session initiation without authentication', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders/checkout')
        .send({
          orderId: createdOrderId,
          successUrl: 'http://localhost:3000/order/success',
          cancelUrl: 'http://localhost:3000/orders'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 Not Found for non-existent order ID', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders/checkout')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: '550e8400-e29b-41d4-a716-446655440999',
          successUrl: 'http://localhost:3000/order/success',
          cancelUrl: 'http://localhost:3000/orders'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should generate mock checkout session URL for pending order', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/orders/checkout')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: createdOrderId,
          successUrl: 'http://localhost:3000/order/success',
          cancelUrl: 'http://localhost:3000/orders'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data).toHaveProperty('checkoutUrl');
      expect(response.body.data.checkoutUrl).toContain('session_id=');
      expect(response.body.data.checkoutUrl).toContain(createdOrderId);
    });
  });

  describe('POST /api/v1/webhooks/mock', () => {
    it('should reject mock webhook without orderId', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/webhooks/mock')
        .send({ status: 'PAID' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should finalize order payment and update status to PAID', async () => {
      const response = await request(orderApp.app)
        .post('/api/v1/webhooks/mock')
        .send({
          orderId: createdOrderId,
          status: 'PAID'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.processed).toBe(true);
      expect(response.body.data.orderId).toBe(createdOrderId);
    });
  });

  describe('GET /api/v1/orders/:id and /my-orders', () => {
    it('should retrieve order details with updated PAID status', async () => {
      const response = await request(orderApp.app)
        .get(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdOrderId);
      expect(response.body.data.status).toBe('PAID');
      expect(response.body.data.paymentId).toBeDefined();
    });

    it('should return 403 Forbidden when another customer attempts to view order', async () => {
      const response = await request(orderApp.app)
        .get(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${otherCustomerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should list customer order history via /my-orders', async () => {
      const response = await request(orderApp.app)
        .get('/api/v1/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      const containsCreatedOrder = response.body.data.some((o: { id: string }) => o.id === createdOrderId);
      expect(containsCreatedOrder).toBe(true);
    });
  });
});
