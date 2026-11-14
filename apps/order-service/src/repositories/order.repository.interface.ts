import { IRepository } from '@ecommerce/common';
import { Order, OrderItem, OrderStatus } from '@ecommerce/database';

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

/**
 * Interface contract for Order persistence operations.
 */
export interface IOrderRepository extends IRepository<Order> {
  findDetailsById(id: string): Promise<OrderWithItems | null>;
  findByUserId(userId: string): Promise<OrderWithItems[]>;
  createOrder(data: {
    userId: string;
    totalAmount: number;
    currency: string;
    paymentProvider: string;
    shippingAddress?: string | null;
    items: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }>;
  }): Promise<OrderWithItems>;
  updateStatus(id: string, status: OrderStatus, paymentId?: string): Promise<OrderWithItems>;
}
