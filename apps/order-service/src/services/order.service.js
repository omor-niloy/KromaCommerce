"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Service orchestrating order lifecycle, inventory verification, and payment processing.
 */
class OrderService extends common_1.BaseService {
    orderRepo;
    db;
    paymentGateway;
    constructor(orderRepo, db, paymentGateway) {
        super();
        this.orderRepo = orderRepo;
        this.db = db;
        this.paymentGateway = paymentGateway;
    }
    async createOrder(userId, input) {
        const productIds = input.items.map((i) => i.productId);
        const products = await this.db.product.findMany({
            where: { id: { in: productIds } }
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestError('One or more selected products no longer exist');
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        const orderItemsData = [];
        let totalAmount = 0;
        for (const item of input.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new common_1.BadRequestError(`Product ${item.productId} not found`);
            }
            if (product.inventoryCount < item.quantity) {
                throw new common_1.BadRequestError(`Insufficient stock for product '${product.name}'`);
            }
            const itemTotal = Math.round(product.price * item.quantity * 100) / 100;
            totalAmount += itemTotal;
            orderItemsData.push({
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
                totalPrice: itemTotal
            });
        }
        totalAmount = Math.round(totalAmount * 100) / 100;
        const providerName = process.env['PAYMENT_PROVIDER'] || 'mock';
        return this.orderRepo.createOrder({
            userId,
            totalAmount,
            currency: input.currency || 'usd',
            paymentProvider: providerName,
            items: orderItemsData
        });
    }
    async createCheckoutSession(userId, userEmail, input) {
        const order = await this.orderRepo.findDetailsById(input.orderId);
        if (!order) {
            throw new common_1.NotFoundError(`Order '${input.orderId}' not found`);
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenError('You are not authorized to checkout this order');
        }
        if (order.status === 'PAID') {
            throw new common_1.BadRequestError('Order is already paid');
        }
        return this.paymentGateway.createCheckoutSession({
            orderId: order.id,
            amount: order.totalAmount,
            currency: order.currency,
            customerEmail: userEmail,
            items: order.items.map((item) => ({
                name: item.productName,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            })),
            successUrl: input.successUrl,
            cancelUrl: input.cancelUrl
        });
    }
    async processStripeWebhook(rawBody, signature) {
        const result = await this.paymentGateway.verifyWebhook(rawBody, signature);
        if (!result.isValid || !result.orderId) {
            return { processed: false };
        }
        if (result.status === 'PAID') {
            await this.finalizeOrderPayment(result.orderId, result.paymentId);
            return { processed: true, orderId: result.orderId };
        }
        if (result.status === 'FAILED') {
            await this.orderRepo.updateStatus(result.orderId, 'FAILED');
            return { processed: true, orderId: result.orderId };
        }
        return { processed: true };
    }
    async processMockWebhook(orderId, status = 'PAID') {
        const order = await this.orderRepo.findDetailsById(orderId);
        if (!order) {
            throw new common_1.NotFoundError(`Order '${orderId}' not found`);
        }
        if (status === 'PAID') {
            await this.finalizeOrderPayment(orderId, `mock_pay_${Date.now()}`);
        }
        else {
            await this.orderRepo.updateStatus(orderId, 'FAILED');
        }
        return { processed: true, orderId };
    }
    async getUserOrders(userId) {
        return this.orderRepo.findByUserId(userId);
    }
    async getOrderById(orderId, userId, isAdmin = false) {
        const order = await this.orderRepo.findDetailsById(orderId);
        if (!order) {
            throw new common_1.NotFoundError(`Order '${orderId}' not found`);
        }
        if (!isAdmin && order.userId !== userId) {
            throw new common_1.ForbiddenError('You are not authorized to view this order');
        }
        return order;
    }
    async finalizeOrderPayment(orderId, paymentId) {
        const order = await this.orderRepo.findDetailsById(orderId);
        if (!order || order.status === 'PAID') {
            return;
        }
        await this.db.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'PAID',
                    ...(paymentId ? { paymentId } : {})
                }
            });
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        inventoryCount: {
                            decrement: item.quantity
                        }
                    }
                });
            }
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map