"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Prisma implementation of Order Repository.
 */
class OrderRepository extends common_1.BaseRepository {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    async findById(id) {
        return this.db.order.findUnique({
            where: { id }
        });
    }
    async findDetailsById(id) {
        return this.db.order.findUnique({
            where: { id },
            include: {
                items: true
            }
        });
    }
    async findByUserId(userId) {
        return this.db.order.findMany({
            where: { userId },
            include: {
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAll() {
        return this.db.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(data) {
        return this.createOrder(data);
    }
    async createOrder(data) {
        return this.db.order.create({
            data: {
                userId: data.userId,
                totalAmount: data.totalAmount,
                currency: data.currency,
                status: 'PENDING',
                paymentProvider: data.paymentProvider,
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice
                    }))
                }
            },
            include: {
                items: true
            }
        });
    }
    async update(id, data) {
        return this.db.order.update({
            where: { id },
            data
        });
    }
    async updateStatus(id, status, paymentId) {
        return this.db.order.update({
            where: { id },
            data: {
                status,
                ...(paymentId ? { paymentId } : {})
            },
            include: {
                items: true
            }
        });
    }
    async delete(id) {
        await this.db.order.delete({
            where: { id }
        });
        return true;
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map