import { IPaymentGateway } from '@ecommerce/common';
/**
 * Factory class for instantiating the appropriate IPaymentGateway strategy.
 */
export declare class PaymentGatewayFactory {
    /**
     * Creates a payment gateway instance based on configuration or explicit provider name.
     */
    static create(provider?: string): IPaymentGateway;
}
//# sourceMappingURL=payment-gateway.factory.d.ts.map