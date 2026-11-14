import express, { Application } from 'express';
import cors from 'cors';
import { ErrorHandlerMiddleware } from '@ecommerce/common';
import { DatabaseConnection } from '@ecommerce/database';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrderRouter } from './routes/order.routes';
import { PaymentGatewayFactory } from './strategies/payment-gateway.factory';

/**
 * Express Application setup class for Order & Checkout microservice.
 */
export class OrderApp {
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
  }

  private setupRoutes(): void {
    const prisma = DatabaseConnection.getInstance();
    const orderRepo = new OrderRepository(prisma);
    const paymentGateway = PaymentGatewayFactory.create();
    const orderService = new OrderService(orderRepo, prisma, paymentGateway);
    const orderController = new OrderController(orderService);
    const orderRouter = new OrderRouter(orderController);

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', service: 'order-service' });
    });

    this.app.use('/api/v1', orderRouter.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }
}
