"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperRouter = void 0;
const express_1 = require("express");
const common_1 = require("@ecommerce/common");
/**
 * Express router builder for price intelligence scraper endpoints.
 */
class ScraperRouter {
    router;
    controller;
    authMiddleware;
    constructor(controller, authMiddleware = new common_1.AuthMiddleware()) {
        this.router = (0, express_1.Router)();
        this.controller = controller;
        this.authMiddleware = authMiddleware;
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/mock-competitor/products/:item', this.controller.renderMockCompetitorPage);
        this.router.get('/api/v1/scraper/compare/:productId', this.controller.getComparison);
        this.router.post('/api/v1/scraper/sync', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), this.controller.syncAll);
        this.router.post('/api/v1/scraper/sync/:productId', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), this.controller.syncProduct);
    }
    getRouter() {
        return this.router;
    }
}
exports.ScraperRouter = ScraperRouter;
//# sourceMappingURL=scraper.routes.js.map