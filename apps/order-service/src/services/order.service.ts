import {
  BaseService,
  IPaymentGateway,
  CreateOrderInput,
  CheckoutSessionInput,
  PaymentSessionResult,
  BadRequestError,
  NotFoundError,
  ForbiddenError
} from '@ecommerce/common';
import { PrismaClient } from '@ecommerce/database';
import { IOrderRepository, OrderWithItems } from '../repositories/order.repository.interface';
import { IOrderService } from './order.service.interface';

/**
 * Service orchestrating order lifecycle, inventory verification, and payment processing.
 */
export class OrderService extends BaseService implements IOrderService {
  private readonly orderRepo: IOrderRepository;
  private readonly db: PrismaClient;
  private readonly paymentGateway: IPaymentGateway;

  constructor(
    orderRepo: IOrderRepository,
    db: PrismaClient,
    paymentGateway: IPaymentGateway
  ) {
    super();
    this.orderRepo = orderRepo;
    this.db = db;
    this.paymentGateway = paymentGateway;
  }

  public async createOrder(userId: string, input: CreateOrderInput): Promise<OrderWithItems> {
    const productIds = input.items.map((i) => i.productId);
    const products = await this.db.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      throw new BadRequestError('One or more selected products no longer exist');
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));
    const orderItemsData: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    let totalAmount = 0;

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestError(`Product ${item.productId} not found`);
      }

      if (product.inventoryCount < item.quantity) {
        throw new BadRequestError(`Insufficient stock for product '${product.name}'`);
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
      shippingAddress: input.shippingAddress || null,
      items: orderItemsData
    });
  }

  public async createCheckoutSession(
    userId: string,
    userEmail: string,
    input: CheckoutSessionInput
  ): Promise<PaymentSessionResult> {
    const order = await this.orderRepo.findDetailsById(input.orderId);
    if (!order) {
      throw new NotFoundError(`Order '${input.orderId}' not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenError('You are not authorized to checkout this order');
    }

    if (order.status === 'PAID') {
      throw new BadRequestError('Order is already paid');
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

  public async processStripeWebhook(
    rawBody: Buffer | string,
    signature?: string
  ): Promise<{ processed: boolean; orderId?: string }> {
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

  public async processMockWebhook(
    orderId: string,
    status: 'PAID' | 'FAILED' = 'PAID'
  ): Promise<{ processed: boolean; orderId: string }> {
    const order = await this.orderRepo.findDetailsById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    if (status === 'PAID') {
      await this.finalizeOrderPayment(orderId, `mock_pay_${Date.now()}`);
    } else {
      await this.orderRepo.updateStatus(orderId, 'FAILED');
    }

    return { processed: true, orderId };
  }

  public async getUserOrders(userId: string): Promise<OrderWithItems[]> {
    return this.orderRepo.findByUserId(userId);
  }

  public async getOrderById(orderId: string, userId: string, isAdmin = false): Promise<OrderWithItems> {
    const order = await this.orderRepo.findDetailsById(orderId);
    if (!order) {
      throw new NotFoundError(`Order '${orderId}' not found`);
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenError('You are not authorized to view this order');
    }

    return order;
  }

  private async finalizeOrderPayment(orderId: string, paymentId?: string): Promise<void> {
    const order = await this.orderRepo.findDetailsById(orderId);
    if (!order || order.status === 'PAID') {
      return;
    }

    await this.db.$transaction(async (tx: any) => {
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
