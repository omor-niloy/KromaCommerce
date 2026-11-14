import { z } from 'zod';
export declare const OrderItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
}, {
    productId: string;
    quantity: number;
}>;
export declare const CreateOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
    }, {
        productId: string;
        quantity: number;
    }>, "many">;
    currency: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        productId: string;
        quantity: number;
    }[];
    currency: string;
}, {
    items: {
        productId: string;
        quantity: number;
    }[];
    currency?: string | undefined;
}>;
export declare const CheckoutSessionSchema: z.ZodObject<{
    orderId: z.ZodString;
    successUrl: z.ZodString;
    cancelUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    successUrl: string;
    cancelUrl: string;
}, {
    orderId: string;
    successUrl: string;
    cancelUrl: string;
}>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CheckoutSessionInput = z.infer<typeof CheckoutSessionSchema>;
//# sourceMappingURL=order.schemas.d.ts.map