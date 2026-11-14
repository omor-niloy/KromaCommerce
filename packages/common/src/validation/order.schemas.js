"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSessionSchema = exports.CreateOrderSchema = exports.OrderItemSchema = void 0;
const zod_1 = require("zod");
exports.OrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid('Invalid product ID'),
    quantity: zod_1.z.number().int().positive('Quantity must be greater than zero')
});
exports.CreateOrderSchema = zod_1.z.object({
    items: zod_1.z.array(exports.OrderItemSchema).min(1, 'Order must contain at least one item'),
    currency: zod_1.z.string().default('usd')
});
exports.CheckoutSessionSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    successUrl: zod_1.z.string().url('Success URL must be valid'),
    cancelUrl: zod_1.z.string().url('Cancel URL must be valid')
});
//# sourceMappingURL=order.schemas.js.map