import Stripe from 'stripe';
import {
  IPaymentGateway,
  CreatePaymentSessionParams,
  PaymentSessionResult,
  WebhookVerificationResult,
  BadRequestError
} from '@ecommerce/common';

/**
 * Stripe implementation of IPaymentGateway strategy.
 */
export class StripePaymentGateway implements IPaymentGateway {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    apiKey: string = process.env['STRIPE_SECRET_KEY'] || 'sk_test_placeholder_key',
    webhookSecret: string = process.env['STRIPE_WEBHOOK_SECRET'] || 'whsec_placeholder_secret'
  ) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16'
    });
    this.webhookSecret = webhookSecret;
  }

  public async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const lineItems = params.items.map((item) => ({
      price_data: {
        currency: params.currency.toLowerCase(),
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.unitPrice * 100)
      },
      quantity: item.quantity
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: params.customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${params.orderId}`,
      cancel_url: `${params.cancelUrl}?order_id=${params.orderId}`,
      metadata: {
        orderId: params.orderId
      }
    });

    if (!session.url) {
      throw new BadRequestError('Failed to generate Stripe checkout URL');
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }

  public async verifyWebhook(rawBody: Buffer | string, signature?: string): Promise<WebhookVerificationResult> {
    if (!signature) {
      return { isValid: false };
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        return {
          isValid: true,
          orderId,
          status: 'PAID',
          paymentId: session.id
        };
      }

      return { isValid: true };
    } catch {
      return { isValid: false };
    }
  }
}
