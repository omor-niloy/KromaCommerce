"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogRouter = void 0;
const express_1 = require("express");
const common_1 = require("@ecommerce/common");
/**
 * Express router builder for products and categories.
 */
class CatalogRouter {
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
        this.router.get('/products', common_1.ValidationMiddleware.validateQuery(common_1.ProductFilterSchema), this.controller.getProducts);
        this.router.get('/products/:idOrSlug', this.controller.getProduct);
        this.router.post('/products', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), common_1.ValidationMiddleware.validateBody(common_1.CreateProductSchema), this.controller.createProduct);
        this.router.put('/products/:id', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), common_1.ValidationMiddleware.validateBody(common_1.UpdateProductSchema), this.controller.updateProduct);
        this.router.delete('/products/:id', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), this.controller.deleteProduct);
        this.router.get('/categories', this.controller.getCategories);
        this.router.post('/categories', this.authMiddleware.authenticate(), this.authMiddleware.requireRole('ADMIN'), common_1.ValidationMiddleware.validateBody(common_1.CreateCategorySchema), this.controller.createCategory);
    }
    getRouter() {
        return this.router;
    }
}
exports.CatalogRouter = CatalogRouter;
//# sourceMappingURL=product.routes.js.map