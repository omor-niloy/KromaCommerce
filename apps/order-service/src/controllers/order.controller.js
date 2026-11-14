"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Controller handling HTTP requests for orders, checkouts, and payment webhooks.
 */
class OrderController extends common_1.BaseController {
    orderService;
    constructor(orderService) {
        super();
        this.orderService = orderService;
    }
    createOrder = async (req, res) => {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedError('Authentication required');
            }
            const order = await this.orderService.createOrder(req.user.userId, req.body);
            return this.sendCreated(res, order);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    createCheckoutSession = async (req, res) => {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedError('Authentication required');
            }
            const result = await this.orderService.createCheckoutSession(req.user.userId, req.user.email, req.body);
            return this.sendSuccess(res, result);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getMyOrders = async (req, res) => {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedError('Authentication required');
            }
            const orders = await this.orderService.getUserOrders(req.user.userId);
            return this.sendSuccess(res, orders);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getOrderById = async (req, res) => {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedError('Authentication required');
            }
            const { id } = req.params;
            const isAdmin = req.user.role === 'ADMIN';
            const order = await this.orderService.getOrderById(id, req.user.userId, isAdmin);
            return this.sendSuccess(res, order);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    handleStripeWebhook = async (req, res) => {
        try {
            const signature = req.headers['stripe-signature'];
            const result = await this.orderService.processStripeWebhook(req.body, signature);
            if (!result.processed) {
                return res.status(400).json({ received: false, error: 'Webhook signature verification failed' });
            }
            return res.status(200).json({ received: true });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    handleMockWebhook = async (req, res) => {
        try {
            const { orderId, status } = req.body;
            if (!orderId) {
                throw new common_1.BadRequestError('orderId is required');
            }
            const result = await this.orderService.processMockWebhook(orderId, status);
            return this.sendSuccess(res, result);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map