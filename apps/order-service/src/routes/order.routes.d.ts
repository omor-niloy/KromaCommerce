import { Router } from 'express';
import { AuthMiddleware } from '@ecommerce/common';
import { OrderController } from '../controllers/order.controller';
/**
 * Express router builder for orders, checkouts, and webhooks.
 */
export declare class OrderRouter {
    private readonly router;
    private readonly controller;
    private readonly authMiddleware;
    constructor(controller: OrderController, authMiddleware?: AuthMiddleware);
    private initRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=order.routes.d.ts.map