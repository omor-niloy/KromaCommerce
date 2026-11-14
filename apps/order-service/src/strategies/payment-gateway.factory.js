"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayFactory = void 0;
const stripe_payment_strategy_1 = require("./stripe-payment.strategy");
const mock_payment_strategy_1 = require("./mock-payment.strategy");
/**
 * Factory class for instantiating the appropriate IPaymentGateway strategy.
 */
class PaymentGatewayFactory {
    /**
     * Creates a payment gateway instance based on configuration or explicit provider name.
     */
    static create(provider = process.env['PAYMENT_PROVIDER'] || 'mock') {
        if (provider.toLowerCase() === 'stripe') {
            return new stripe_payment_strategy_1.StripePaymentGateway();
        }
        return new mock_payment_strategy_1.MockPaymentGateway();
    }
}
exports.PaymentGatewayFactory = PaymentGatewayFactory;
//# sourceMappingURL=payment-gateway.factory.js.map