import { Request, Response } from 'express';
import { BaseController } from '@ecommerce/common';
import { IOrderService } from '../services/order.service.interface';
/**
 * Controller handling HTTP requests for orders, checkouts, and payment webhooks.
 */
export declare class OrderController extends BaseController {
    private readonly orderService;
    constructor(orderService: IOrderService);
    createOrder: (req: Request, res: Response) => Promise<Response>;
    createCheckoutSession: (req: Request, res: Response) => Promise<Response>;
    getMyOrders: (req: Request, res: Response) => Promise<Response>;
    getOrderById: (req: Request, res: Response) => Promise<Response>;
    handleStripeWebhook: (req: Request, res: Response) => Promise<Response>;
    handleMockWebhook: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=order.controller.d.ts.map