/**
 * Request payload for creating a checkout payment session.
 */
export interface CreatePaymentSessionParams {
    orderId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    items: Array<{
        name: string;
        unitPrice: number;
        quantity: number;
    }>;
    successUrl: string;
    cancelUrl: string;
}
/**
 * Result returned after initializing a payment session.
 */
export interface PaymentSessionResult {
    sessionId: string;
    checkoutUrl: string;
}
/**
 * Result returned from verifying a webhook payload.
 */
export interface WebhookVerificationResult {
    isValid: boolean;
    orderId?: string;
    status?: 'PAID' | 'FAILED';
    paymentId?: string;
}
/**
 * Strategy interface abstraction for payment gateways (Stripe, Mock, etc.).
 */
export interface IPaymentGateway {
    /**
     * Initializes a payment checkout session.
     */
    createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>;
    /**
     * Verifies an incoming webhook signature and parses payment state.
     */
    verifyWebhook(rawBody: Buffer | string, signature?: string): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=payment-gateway.interface.d.ts.map