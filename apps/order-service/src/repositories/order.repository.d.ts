import { PrismaClient, Order, OrderStatus } from '@ecommerce/database';
import { BaseRepository } from '@ecommerce/common';
import { IOrderRepository, OrderWithItems } from './order.repository.interface';
/**
 * Prisma implementation of Order Repository.
 */
export declare class OrderRepository extends BaseRepository<Order> implements IOrderRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findById(id: string): Promise<Order | null>;
    findDetailsById(id: string): Promise<OrderWithItems | null>;
    findByUserId(userId: string): Promise<OrderWithItems[]>;
    findAll(): Promise<Order[]>;
    create(data: any): Promise<Order>;
    createOrder(data: {
        userId: string;
        totalAmount: number;
        currency: string;
        paymentProvider: string;
        items: Array<{
            productId: string;
            productName: string;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
        }>;
    }): Promise<OrderWithItems>;
    update(id: string, data: any): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, paymentId?: string): Promise<OrderWithItems>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=order.repository.d.ts.map