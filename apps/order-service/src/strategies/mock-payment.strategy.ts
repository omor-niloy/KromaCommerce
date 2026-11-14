import {
  IPaymentGateway,
  CreatePaymentSessionParams,
  PaymentSessionResult,
  WebhookVerificationResult
} from '@ecommerce/common';

/**
 * Deterministic Mock payment gateway strategy for CI and automated testing.
 */
export class MockPaymentGateway implements IPaymentGateway {
  public async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const mockSessionId = `mock_session_${Date.now()}_${params.orderId.substring(0, 8)}`;
    const checkoutUrl = `${params.successUrl}?session_id=${mockSessionId}&order_id=${params.orderId}&mode=mock`;

    return {
      sessionId: mockSessionId,
      checkoutUrl
    };
  }

  public async verifyWebhook(rawBody: Buffer | string): Promise<WebhookVerificationResult> {
    try {
      const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
      return {
        isValid: true,
        orderId: payload.orderId,
        status: payload.status === 'FAILED' ? 'FAILED' : 'PAID',
        paymentId: payload.paymentId || `mock_pay_${Date.now()}`
      };
    } catch {
      return { isValid: false };
    }
  }
}
