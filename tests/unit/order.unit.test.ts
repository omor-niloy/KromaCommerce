import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  OrderItemSchema,
  CreateOrderSchema,
  CheckoutSessionSchema
} from '@ecommerce/common';
import {
  PaymentGatewayFactory,
  MockPaymentGateway,
  StripePaymentGateway
} from '@ecommerce/order-service';

/**
 * Unit test suite verifying Order domain calculations, payment gateway strategies, and validation schemas.
 */
describe('Order Unit Tests', () => {
  describe('Order Pricing & Currency Math', () => {
    /**
     * Helper replicating order item price rounding logic defined in OrderService.
     */
    const calculateItemTotal = (price: number, quantity: number): number => {
      return Math.round(price * quantity * 100) / 100;
    };

    /**
     * Helper replicating order cumulative total rounding logic defined in OrderService.
     */
    const calculateOrderTotal = (items: Array<{ price: number; quantity: number }>): number => {
      const sum = items.reduce((acc, item) => acc + calculateItemTotal(item.price, item.quantity), 0);
      return Math.round(sum * 100) / 100;
    };

    it('should accurately calculate total without floating point inaccuracies', () => {
      const items = [
        { price: 19.99, quantity: 3 }, // 59.97
        { price: 9.95, quantity: 2 },  // 19.90
        { price: 0.99, quantity: 5 }   // 4.95
      ];

      const expectedTotal = 59.97 + 19.90 + 4.95; // 84.82
      const actualTotal = calculateOrderTotal(items);

      expect(actualTotal).toEqual(84.82);
    });

    it('should handle typical floating-point precision edge cases cleanly', () => {
      // 0.1 + 0.2 in JS IEEE 754 produces 0.30000000000000004
      const items = [
        { price: 0.10, quantity: 1 },
        { price: 0.20, quantity: 1 }
      ];

      const actualTotal = calculateOrderTotal(items);
      expect(actualTotal).toEqual(0.30);
    });

    it('should correctly round sub-cent fractional values', () => {
      expect(calculateItemTotal(10.555, 1)).toEqual(10.56);
      expect(calculateItemTotal(10.554, 1)).toEqual(10.55);
    });
  });

  describe('PaymentGatewayFactory (Strategy Pattern)', () => {
    const originalEnv = process.env['PAYMENT_PROVIDER'];

    afterEach(() => {
      process.env['PAYMENT_PROVIDER'] = originalEnv;
    });

    it('should return MockPaymentGateway when provider is explicitly "mock"', () => {
      const gateway = PaymentGatewayFactory.create('mock');
      expect(gateway).toBeInstanceOf(MockPaymentGateway);
    });

    it('should be case-insensitive when resolving provider name', () => {
      const gatewayMock = PaymentGatewayFactory.create('MOCK');
      expect(gatewayMock).toBeInstanceOf(MockPaymentGateway);

      const gatewayStripe = PaymentGatewayFactory.create('STRIPE');
      expect(gatewayStripe).toBeInstanceOf(StripePaymentGateway);
    });

    it('should return StripePaymentGateway when provider is "stripe"', () => {
      const gateway = PaymentGatewayFactory.create('stripe');
      expect(gateway).toBeInstanceOf(StripePaymentGateway);
    });

    it('should fallback to MockPaymentGateway for unknown providers', () => {
      const gateway = PaymentGatewayFactory.create('paypal-unsupported');
      expect(gateway).toBeInstanceOf(MockPaymentGateway);
    });

    it('should resolve provider from environment variable when omitted', () => {
      process.env['PAYMENT_PROVIDER'] = 'stripe';
      const stripeGateway = PaymentGatewayFactory.create();
      expect(stripeGateway).toBeInstanceOf(StripePaymentGateway);

      process.env['PAYMENT_PROVIDER'] = 'mock';
      const mockGateway = PaymentGatewayFactory.create();
      expect(mockGateway).toBeInstanceOf(MockPaymentGateway);
    });
  });

  describe('MockPaymentGateway', () => {
    let mockGateway: MockPaymentGateway;

    beforeEach(() => {
      mockGateway = new MockPaymentGateway();
    });

    it('should generate deterministic checkout session with expected parameters', async () => {
      const params = {
        orderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        userEmail: 'customer@kromacommerce.com',
        items: [
          {
            name: 'Kroma Wireless Headphones',
            unitPrice: 199.99,
            quantity: 1,
            totalPrice: 199.99
          }
        ],
        totalAmount: 199.99,
        currency: 'usd',
        successUrl: 'http://localhost:3000/order/success',
        cancelUrl: 'http://localhost:3000/orders'
      };

      const result = await mockGateway.createCheckoutSession(params);

      expect(result.sessionId).toBeDefined();
      expect(result.sessionId.startsWith('mock_session_')).toBe(true);
      expect(result.sessionId).toContain('a1b2c3d4');
      expect(result.checkoutUrl).toBeDefined();
      expect(result.checkoutUrl).toContain(params.successUrl);
      expect(result.checkoutUrl).toContain(`session_id=${result.sessionId}`);
      expect(result.checkoutUrl).toContain(`order_id=${params.orderId}`);
      expect(result.checkoutUrl).toContain('mode=mock');
    });

    it('should verify valid mock webhook string payloads as PAID', async () => {
      const payloadString = JSON.stringify({
        orderId: 'order-test-uuid-1',
        status: 'PAID'
      });

      const verification = await mockGateway.verifyWebhook(payloadString);

      expect(verification.isValid).toBe(true);
      expect(verification.orderId).toBe('order-test-uuid-1');
      expect(verification.status).toBe('PAID');
      expect(verification.paymentId).toBeDefined();
    });

    it('should verify mock webhook buffer payloads', async () => {
      const buffer = Buffer.from(JSON.stringify({
        orderId: 'order-test-uuid-2',
        status: 'PAID',
        paymentId: 'pay_custom_123'
      }));

      const verification = await mockGateway.verifyWebhook(buffer);

      expect(verification.isValid).toBe(true);
      expect(verification.orderId).toBe('order-test-uuid-2');
      expect(verification.status).toBe('PAID');
      expect(verification.paymentId).toBe('pay_custom_123');
    });

    it('should handle FAILED status in mock webhook payload', async () => {
      const payloadString = JSON.stringify({
        orderId: 'order-test-uuid-failed',
        status: 'FAILED'
      });

      const verification = await mockGateway.verifyWebhook(payloadString);

      expect(verification.isValid).toBe(true);
      expect(verification.status).toBe('FAILED');
    });

    it('should return isValid: false when receiving non-JSON payload', async () => {
      const verification = await mockGateway.verifyWebhook('malformed-non-json-content');

      expect(verification.isValid).toBe(false);
      expect(verification.orderId).toBeUndefined();
    });
  });

  describe('Order Zod Validation Schemas', () => {
    describe('OrderItemSchema', () => {
      it('should validate valid item input', () => {
        const item = {
          productId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        };

        const result = OrderItemSchema.safeParse(item);
        expect(result.success).toBe(true);
      });

      it('should reject non-UUID productId', () => {
        const item = {
          productId: 'invalid-non-uuid-string',
          quantity: 1
        };

        const result = OrderItemSchema.safeParse(item);
        expect(result.success).toBe(false);
      });

      it('should reject negative or zero quantities', () => {
        expect(OrderItemSchema.safeParse({ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 0 }).success).toBe(false);
        expect(OrderItemSchema.safeParse({ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: -1 }).success).toBe(false);
        expect(OrderItemSchema.safeParse({ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1.5 }).success).toBe(false);
      });
    });

    describe('CreateOrderSchema', () => {
      it('should validate valid order with default currency', () => {
        const order = {
          items: [
            { productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1 }
          ]
        };

        const result = CreateOrderSchema.safeParse(order);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.currency).toBe('usd');
        }
      });

      it('should reject order with empty items array', () => {
        const order = { items: [] };
        const result = CreateOrderSchema.safeParse(order);
        expect(result.success).toBe(false);
      });
    });

    describe('CheckoutSessionSchema', () => {
      it('should validate valid checkout session parameters', () => {
        const payload = {
          orderId: '550e8400-e29b-41d4-a716-446655440000',
          successUrl: 'http://localhost:3000/order/success',
          cancelUrl: 'http://localhost:3000/orders'
        };

        const result = CheckoutSessionSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it('should reject invalid URLs', () => {
        const payload = {
          orderId: '550e8400-e29b-41d4-a716-446655440000',
          successUrl: 'invalid-url',
          cancelUrl: 'http://localhost:3000/orders'
        };

        const result = CheckoutSessionSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });
  });
});
