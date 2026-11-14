"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@ecommerce/common");
const database_1 = require("@ecommerce/database");
const order_repository_1 = require("./repositories/order.repository");
const order_service_1 = require("./services/order.service");
const order_controller_1 = require("./controllers/order.controller");
const order_routes_1 = require("./routes/order.routes");
const payment_gateway_factory_1 = require("./strategies/payment-gateway.factory");
/**
 * Express Application setup class for Order & Checkout microservice.
 */
class OrderApp {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
            credentials: true
        }));
    }
    setupRoutes() {
        const prisma = database_1.DatabaseConnection.getInstance();
        const orderRepo = new order_repository_1.OrderRepository(prisma);
        const paymentGateway = payment_gateway_factory_1.PaymentGatewayFactory.create();
        const orderService = new order_service_1.OrderService(orderRepo, prisma, paymentGateway);
        const orderController = new order_controller_1.OrderController(orderService);
        const orderRouter = new order_routes_1.OrderRouter(orderController);
        this.app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok', service: 'order-service' });
        });
        this.app.use('/api/v1', orderRouter.getRouter());
    }
    setupErrorHandling() {
        this.app.use(common_1.ErrorHandlerMiddleware.handle);
    }
}
exports.OrderApp = OrderApp;
//# sourceMappingURL=app.js.map