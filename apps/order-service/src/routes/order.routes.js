"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importStar(require("express"));
const common_1 = require("@ecommerce/common");
/**
 * Express router builder for orders, checkouts, and webhooks.
 */
class OrderRouter {
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
        this.router.post('/webhooks/stripe', express_1.default.raw({ type: 'application/json' }), this.controller.handleStripeWebhook);
        this.router.post('/webhooks/mock', express_1.default.json(), this.controller.handleMockWebhook);
        this.router.post('/orders', express_1.default.json(), this.authMiddleware.authenticate(), common_1.ValidationMiddleware.validateBody(common_1.CreateOrderSchema), this.controller.createOrder);
        this.router.post('/orders/checkout', express_1.default.json(), this.authMiddleware.authenticate(), common_1.ValidationMiddleware.validateBody(common_1.CheckoutSessionSchema), this.controller.createCheckoutSession);
        this.router.get('/orders/my-orders', this.authMiddleware.authenticate(), this.controller.getMyOrders);
        this.router.get('/orders/:id', this.authMiddleware.authenticate(), this.controller.getOrderById);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
//# sourceMappingURL=order.routes.js.map