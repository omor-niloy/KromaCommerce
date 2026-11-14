# Order & Payment Microservice (`apps/order-service`)

## 1. Role & Purpose
The Order microservice orchestrates the complete shopping cart checkout lifecycle, order state machine (`PENDING` ➔ `PAID`), payment session initialization, and cryptographic webhook verification.

## 2. Port & Configuration
- **Port:** `8003`
- **Environment Variables:**
  - `PORT`: Service port (default: 8003)
  - `DATABASE_URL`: PostgreSQL connection string
  - `STRIPE_SECRET_KEY`: Stripe API secret key
  - `STRIPE_WEBHOOK_SECRET`: Stripe HMAC webhook signing secret
  - `PAYMENT_PROVIDER`: `mock` (for CI/automated testing) or `stripe`

## 3. Strategy Pattern for Payments
- **Abstraction:** `IPaymentGateway` interface defining:
  - `createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>`
  - `verifyWebhook(rawBody: Buffer | string, signature?: string): Promise<WebhookVerificationResult>`
- **Concrete Strategies:**
  - `StripePaymentGateway`: Uses official Stripe Node.js SDK for production and test checkout sessions.
  - `MockPaymentGateway`: Zero-latency, deterministic payment provider designed for fast, isolated CI and Playwright E2E browser automation.
- **Factory:** `PaymentGatewayFactory.create()` dynamically resolves the strategy based on `PAYMENT_PROVIDER`.

## 4. Webhook Security & Raw Body Preservation
Stripe requires the unparsed raw byte buffer of incoming webhook requests to verify HMAC-SHA256 signatures. The Order Service registers `express.raw({ type: 'application/json' })` exclusively on the `/api/v1/webhooks/stripe` route before general JSON body parsers execute.

## 5. Shipping Address & Gateway Offline Lifecycle
- **Shipping Address Ingestion:** During order creation (`POST /api/v1/orders`), the client submits `shippingAddress` alongside selected product line items.
- **Gateway Offline Policy:** When the payment gateway is undergoing maintenance or offline, orders are captured with status `PENDING`. Direct payment finalization is blocked until payment connectivity is confirmed, preventing unverified order finalization.
