import { BaseService, IPaymentGateway, CreateOrderInput, CheckoutSessionInput, PaymentSessionResult } from '@ecommerce/common';
import { PrismaClient } from '@ecommerce/database';
import { IOrderRepository, OrderWithItems } from '../repositories/order.repository.interface';
import { IOrderService } from './order.service.interface';
/**
 * Service orchestrating order lifecycle, inventory verification, and payment processing.
 */
export declare class OrderService extends BaseService implements IOrderService {
    private readonly orderRepo;
    private readonly db;
    private readonly paymentGateway;
    constructor(orderRepo: IOrderRepository, db: PrismaClient, paymentGateway: IPaymentGateway);
    createOrder(userId: string, input: CreateOrderInput): Promise<OrderWithItems>;
    createCheckoutSession(userId: string, userEmail: string, input: CheckoutSessionInput): Promise<PaymentSessionResult>;
    processStripeWebhook(rawBody: Buffer | string, signature?: string): Promise<{
        processed: boolean;
        orderId?: string;
    }>;
    processMockWebhook(orderId: string, status?: 'PAID' | 'FAILED'): Promise<{
        processed: boolean;
        orderId: string;
    }>;
    getUserOrders(userId: string): Promise<OrderWithItems[]>;
    getOrderById(orderId: string, userId: string, isAdmin?: boolean): Promise<OrderWithItems>;
    private finalizeOrderPayment;
}
//# sourceMappingURL=order.service.d.ts.map