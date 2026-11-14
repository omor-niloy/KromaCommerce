import express, { Router } from 'express';
import {
  ValidationMiddleware,
  AuthMiddleware,
  CreateOrderSchema,
  CheckoutSessionSchema
} from '@ecommerce/common';
import { OrderController } from '../controllers/order.controller';

/**
 * Express router builder for orders, checkouts, and webhooks.
 */
export class OrderRouter {
  private readonly router: Router;
  private readonly controller: OrderController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(
    controller: OrderController,
    authMiddleware: AuthMiddleware = new AuthMiddleware()
  ) {
    this.router = Router();
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post(
      '/webhooks/stripe',
      express.raw({ type: 'application/json' }),
      this.controller.handleStripeWebhook
    );

    this.router.post(
      '/webhooks/mock',
      express.json(),
      this.controller.handleMockWebhook
    );

    this.router.post(
      '/orders',
      express.json(),
      this.authMiddleware.authenticate(),
      ValidationMiddleware.validateBody(CreateOrderSchema),
      this.controller.createOrder
    );

    this.router.post(
      '/orders/checkout',
      express.json(),
      this.authMiddleware.authenticate(),
      ValidationMiddleware.validateBody(CheckoutSessionSchema),
      this.controller.createCheckoutSession
    );

    this.router.get(
      '/orders/my-orders',
      this.authMiddleware.authenticate(),
      this.controller.getMyOrders
    );

    this.router.get(
      '/orders/:id',
      this.authMiddleware.authenticate(),
      this.controller.getOrderById
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
