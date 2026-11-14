# Orders & Checkout API Specification

Base Path: `/api/v1`

---

## 1. Create Pending Order
- **Endpoint:** `POST /api/v1/orders`
- **Access:** Authenticated (`Bearer <access_token>`)
- **Description:** Verifies current stock availability, locks pricing, and creates an order in `PENDING` state.

### Request Body
```json
{
  "items": [
    {
      "productId": "e58b16c4-1188-42f0-9b45-21d7821619a1",
      "quantity": 2
    }
  ],
  "currency": "usd"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "76426462-cbbf-49f2-8c10-91c856758410",
    "userId": "c7a8b66e-52f2-4c22-b5b4-d53b50f00001",
    "totalAmount": 399.98,
    "currency": "usd",
    "status": "PENDING",
    "paymentProvider": "mock",
    "items": [
      {
        "id": "...",
        "productId": "e58b16c4-1188-42f0-9b45-21d7821619a1",
        "productName": "Kroma Noise-Cancelling Wireless Headphones",
        "unitPrice": 199.99,
        "quantity": 2,
        "totalPrice": 399.98
      }
    ],
    "createdAt": "2026-11-14T02:30:00.000Z",
    "updatedAt": "2026-11-14T02:30:00.000Z"
  }
}
```

---

## 2. Initialize Checkout Session
- **Endpoint:** `POST /api/v1/orders/checkout`
- **Access:** Authenticated (`Bearer <access_token>`)
- **Description:** Leverages the Strategy Pattern (`IPaymentGateway`) to generate either a Stripe Checkout URL or a deterministic Mock Checkout URL for testing.

### Request Body
```json
{
  "orderId": "76426462-cbbf-49f2-8c10-91c856758410",
  "successUrl": "http://localhost:3000/order/success",
  "cancelUrl": "http://localhost:3000/orders"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "sessionId": "mock_session_1700000000_76426462",
    "checkoutUrl": "http://localhost:3000/order/success?session_id=mock_session_1700000000_76426462&order_id=76426462-cbbf-49f2-8c10-91c856758410&mode=mock"
  }
}
```

---

## 3. Stripe Signed Webhook
- **Endpoint:** `POST /api/v1/webhooks/stripe`
- **Access:** Public (cryptographically authenticated via Stripe HMAC signature)
- **Header:** `stripe-signature: t=...,v1=...`
- **Body:** Raw JSON buffer (`express.raw({ type: 'application/json' })`)
- **Action:** Validates signature against `STRIPE_WEBHOOK_SECRET`, transitions order status to `PAID`, and atomically decrements product inventory.

---

## 4. Mock Payment Webhook (CI & Automated Test Mode)
- **Endpoint:** `POST /api/v1/webhooks/mock`
- **Access:** Public / Internal
- **Request Body:**
```json
{
  "orderId": "76426462-cbbf-49f2-8c10-91c856758410",
  "status": "PAID"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "processed": true,
    "orderId": "76426462-cbbf-49f2-8c10-91c856758410"
  }
}
```

---

## 5. Get User Orders
- **Endpoint:** `GET /api/v1/orders/my-orders`
- **Access:** Authenticated (`Bearer <access_token>`)
- **Response (200 OK):** Array of customer order models with line items.
