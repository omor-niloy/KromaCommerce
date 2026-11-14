/**
 * Lifecycle states of a customer order.
 */
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'SHIPPED';
/**
 * Line item within an order.
 */
export interface OrderItemModel {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}
/**
 * Customer order domain representation.
 */
export interface OrderModel {
    id: string;
    userId: string;
    totalAmount: number;
    currency: string;
    status: OrderStatus;
    paymentId?: string | null;
    paymentProvider: string;
    items: OrderItemModel[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=order.interface.d.ts.map