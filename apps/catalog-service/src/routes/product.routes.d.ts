import { Router } from 'express';
import { AuthMiddleware } from '@ecommerce/common';
import { ProductController } from '../controllers/product.controller';
/**
 * Express router builder for products and categories.
 */
export declare class CatalogRouter {
    private readonly router;
    private readonly controller;
    private readonly authMiddleware;
    constructor(controller: ProductController, authMiddleware?: AuthMiddleware);
    private initRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=product.routes.d.ts.map