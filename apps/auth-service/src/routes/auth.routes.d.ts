import { Router } from 'express';
import { AuthMiddleware } from '@ecommerce/common';
import { AuthController } from '../controllers/auth.controller';
/**
 * Express router builder for authentication and profile routes.
 */
export declare class AuthRouter {
    private readonly router;
    private readonly controller;
    private readonly authMiddleware;
    constructor(controller: AuthController, authMiddleware?: AuthMiddleware);
    private initRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=auth.routes.d.ts.map