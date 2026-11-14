import { IPaymentGateway, CreatePaymentSessionParams, PaymentSessionResult, WebhookVerificationResult } from '@ecommerce/common';
/**
 * Deterministic Mock payment gateway strategy for CI and automated testing.
 */
export declare class MockPaymentGateway implements IPaymentGateway {
    createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>;
    verifyWebhook(rawBody: Buffer | string): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=mock-payment.strategy.d.ts.map