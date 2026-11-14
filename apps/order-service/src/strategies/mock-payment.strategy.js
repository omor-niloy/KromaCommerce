"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentGateway = void 0;
/**
 * Deterministic Mock payment gateway strategy for CI and automated testing.
 */
class MockPaymentGateway {
    async createCheckoutSession(params) {
        const mockSessionId = `mock_session_${Date.now()}_${params.orderId.substring(0, 8)}`;
        const checkoutUrl = `${params.successUrl}?session_id=${mockSessionId}&order_id=${params.orderId}&mode=mock`;
        return {
            sessionId: mockSessionId,
            checkoutUrl
        };
    }
    async verifyWebhook(rawBody) {
        try {
            const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
            return {
                isValid: true,
                orderId: payload.orderId,
                status: payload.status === 'FAILED' ? 'FAILED' : 'PAID',
                paymentId: payload.paymentId || `mock_pay_${Date.now()}`
            };
        }
        catch {
            return { isValid: false };
        }
    }
}
exports.MockPaymentGateway = MockPaymentGateway;
//# sourceMappingURL=mock-payment.strategy.js.map