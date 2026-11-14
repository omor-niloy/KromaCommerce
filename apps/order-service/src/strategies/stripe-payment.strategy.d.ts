import { IPaymentGateway, CreatePaymentSessionParams, PaymentSessionResult, WebhookVerificationResult } from '@ecommerce/common';
/**
 * Stripe implementation of IPaymentGateway strategy.
 */
export declare class StripePaymentGateway implements IPaymentGateway {
    private readonly stripe;
    private readonly webhookSecret;
    constructor(apiKey?: string, webhookSecret?: string);
    createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>;
    verifyWebhook(rawBody: Buffer | string, signature?: string): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=stripe-payment.strategy.d.ts.map