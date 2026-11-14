import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be greater than zero')
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  currency: z.string().default('usd'),
  shippingAddress: z.string().optional()
});

export const CheckoutSessionSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  successUrl: z.string().url('Success URL must be valid'),
  cancelUrl: z.string().url('Cancel URL must be valid')
});

export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CheckoutSessionInput = z.infer<typeof CheckoutSessionSchema>;
