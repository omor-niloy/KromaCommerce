# API Gateway Specification

Base Port: `8000`

---

## 1. Health Check
- **Endpoint:** `GET /health`
- **Access:** Public
- **Description:** Verifies Gateway process status, execution mode, and active timestamp.

### Response (200 OK)
```json
{
  "status": "ok",
  "service": "api-gateway",
  "mode": "consolidated",
  "timestamp": "2026-11-14T02:45:00.000Z"
}
```

---

## 2. Ingress & Security Features
- **Helmet:** Sets Content-Security-Policy, strict frame denial, nosniff, and strict HSTS.
- **CORS Whitelist:** Validates origin against `FRONTEND_URL` (`http://localhost:3000` in local dev).
- **Rate Limiting:**
  - Global API: 300 requests per 15-minute sliding window.
  - Auth routes (`/api/v1/auth/login`, `/api/v1/auth/register`): 30 requests per 15-minute window to defend against brute force attempts.
- **Reverse Proxy Routing:**
  - Forwarding to `/api/v1/auth/*` ➔ Auth Service
  - Forwarding to `/api/v1/products/*`, `/api/v1/categories/*` ➔ Catalog Service
  - Forwarding to `/api/v1/orders/*`, `/api/v1/webhooks/*` ➔ Order Service
  - Forwarding to `/api/v1/scraper/*`, `/mock-competitor/*` ➔ Scraper Service
