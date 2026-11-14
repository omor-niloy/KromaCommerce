import { IPaymentGateway } from '@ecommerce/common';
import { StripePaymentGateway } from './stripe-payment.strategy';
import { MockPaymentGateway } from './mock-payment.strategy';

/**
 * Factory class for instantiating the appropriate IPaymentGateway strategy.
 */
export class PaymentGatewayFactory {
  /**
   * Creates a payment gateway instance based on configuration or explicit provider name.
   */
  public static create(provider: string = process.env['PAYMENT_PROVIDER'] || 'mock'): IPaymentGateway {
    if (provider.toLowerCase() === 'stripe') {
      return new StripePaymentGateway();
    }
    return new MockPaymentGateway();
  }
}
