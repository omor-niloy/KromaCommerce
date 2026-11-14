"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentGateway = void 0;
const stripe_1 = __importDefault(require("stripe"));
const common_1 = require("@ecommerce/common");
/**
 * Stripe implementation of IPaymentGateway strategy.
 */
class StripePaymentGateway {
    stripe;
    webhookSecret;
    constructor(apiKey = process.env['STRIPE_SECRET_KEY'] || 'sk_test_placeholder_key', webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] || 'whsec_placeholder_secret') {
        this.stripe = new stripe_1.default(apiKey, {
            apiVersion: '2023-10-16'
        });
        this.webhookSecret = webhookSecret;
    }
    async createCheckoutSession(params) {
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
            throw new common_1.BadRequestError('Failed to generate Stripe checkout URL');
        }
        return {
            sessionId: session.id,
            checkoutUrl: session.url
        };
    }
    async verifyWebhook(rawBody, signature) {
        if (!signature) {
            return { isValid: false };
        }
        try {
            const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;
                return {
                    isValid: true,
                    orderId,
                    status: 'PAID',
                    paymentId: session.id
                };
            }
            return { isValid: true };
        }
        catch {
            return { isValid: false };
        }
    }
}
exports.StripePaymentGateway = StripePaymentGateway;
//# sourceMappingURL=stripe-payment.strategy.js.map