import { Router } from 'express';
import { AuthMiddleware } from '@ecommerce/common';
import { ScraperController } from '../controllers/scraper.controller';
/**
 * Express router builder for price intelligence scraper endpoints.
 */
export declare class ScraperRouter {
    private readonly router;
    private readonly controller;
    private readonly authMiddleware;
    constructor(controller: ScraperController, authMiddleware?: AuthMiddleware);
    private initRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=scraper.routes.d.ts.map