import { PrismaClient, Order, OrderStatus } from '@ecommerce/database';
import { BaseRepository } from '@ecommerce/common';
import { IOrderRepository, OrderWithItems } from './order.repository.interface';

/**
 * Prisma implementation of Order Repository.
 */
export class OrderRepository extends BaseRepository<Order> implements IOrderRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    super();
    this.db = db;
  }

  public async findById(id: string): Promise<Order | null> {
    return this.db.order.findUnique({
      where: { id }
    });
  }

  public async findDetailsById(id: string): Promise<OrderWithItems | null> {
    return this.db.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
  }

  public async findByUserId(userId: string): Promise<OrderWithItems[]> {
    return this.db.order.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async findAll(): Promise<Order[]> {
    return this.db.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async create(data: any): Promise<Order> {
    return this.createOrder(data);
  }

  public async createOrder(data: {
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
  }): Promise<OrderWithItems> {
    return this.db.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        currency: data.currency,
        status: 'PENDING',
        paymentProvider: data.paymentProvider,
        shippingAddress: data.shippingAddress || null,
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

  public async update(id: string, data: any): Promise<Order> {
    return this.db.order.update({
      where: { id },
      data
    });
  }

  public async updateStatus(id: string, status: OrderStatus, paymentId?: string): Promise<OrderWithItems> {
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

  public async delete(id: string): Promise<boolean> {
    await this.db.order.delete({
      where: { id }
    });
    return true;
  }
}
