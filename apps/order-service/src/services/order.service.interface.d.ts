import { CreateOrderInput, CheckoutSessionInput, PaymentSessionResult } from '@ecommerce/common';
import { OrderWithItems } from '../repositories/order.repository.interface';
/**
 * Interface contract for Order and Payment orchestration logic.
 */
export interface IOrderService {
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
}
//# sourceMappingURL=order.service.interface.d.ts.map