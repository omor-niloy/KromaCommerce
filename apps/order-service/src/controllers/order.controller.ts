import { Request, Response } from 'express';
import { BaseController, UnauthorizedError, BadRequestError } from '@ecommerce/common';
import { IOrderService } from '../services/order.service.interface';

/**
 * Controller handling HTTP requests for orders, checkouts, and payment webhooks.
 */
export class OrderController extends BaseController {
  private readonly orderService: IOrderService;

  constructor(orderService: IOrderService) {
    super();
    this.orderService = orderService;
  }

  public createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const order = await this.orderService.createOrder(req.user.userId, req.body);
      return this.sendCreated(res, order);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public createCheckoutSession = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const result = await this.orderService.createCheckoutSession(
        req.user.userId,
        req.user.email,
        req.body
      );
      return this.sendSuccess(res, result);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getMyOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const orders = await this.orderService.getUserOrders(req.user.userId);
      return this.sendSuccess(res, orders);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const isAdmin = req.user.role === 'ADMIN';
      const order = await this.orderService.getOrderById(id as string, req.user.userId, isAdmin);
      return this.sendSuccess(res, order);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public handleStripeWebhook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const signature = req.headers['stripe-signature'] as string | undefined;
      const result = await this.orderService.processStripeWebhook(req.body, signature);
      if (!result.processed) {
        return res.status(400).json({ received: false, error: 'Webhook signature verification failed' });
      }
      return res.status(200).json({ received: true });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public handleMockWebhook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId, status } = req.body;
      if (!orderId) {
        throw new BadRequestError('orderId is required');
      }
      const result = await this.orderService.processMockWebhook(orderId, status);
      return this.sendSuccess(res, result);
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
