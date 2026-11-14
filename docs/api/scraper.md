# Scraper & Price Intelligence API Specification

Base Path: `/api/v1/scraper` & `/mock-competitor`

---

## 1. Get Product Price Comparison
- **Endpoint:** `GET /api/v1/scraper/compare/:productId`
- **Access:** Public
- **Description:** Returns aggregate price intelligence comparing our catalog price with historical competitor snapshots.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "productId": "e58b16c4-1188-42f0-9b45-21d7821619a1",
    "productName": "Kroma Noise-Cancelling Wireless Headphones",
    "ourPrice": 199.99,
    "lowestCompetitorPrice": 229.99,
    "averageCompetitorPrice": 229.99,
    "differencePercentage": 15.0,
    "records": [
      {
        "id": "76426462-cbbf-49f2-8c10-91c856758410",
        "productId": "e58b16c4-1188-42f0-9b45-21d7821619a1",
        "competitorName": "ElectroStore Express",
        "competitorUrl": "http://localhost:8004/mock-competitor/products/headphones",
        "price": 229.99,
        "currency": "usd",
        "differencePercentage": 15.0,
        "createdAt": "2026-11-14T02:00:00.000Z"
      }
    ]
  }
}
```

---

## 2. Trigger Headless Price Sync
- **Endpoint:** `POST /api/v1/scraper/sync`
- **Access:** Admin only (`Bearer <access_token>`, Role: `ADMIN`)
- **Description:** Spawns memory-optimized Playwright headless browser instances to crawl competitor URLs and persist new price records.

### Request Body
```json
{
  "limit": 10
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalSynced": 6,
    "items": [
      {
        "productId": "e58b16c4-1188-42f0-9b45-21d7821619a1",
        "productName": "Kroma Noise-Cancelling Wireless Headphones",
        "ourPrice": 199.99,
        "competitorPrice": 229.99,
        "competitorName": "ElectroStore Express",
        "differencePercentage": 15.0,
        "scrapedAt": "2026-11-14T02:45:00.000Z"
      }
    ]
  }
}
```

---

## 3. Mock Competitor Web Storefront
- **Endpoint:** `GET /mock-competitor/products/:item`
- **Access:** Public
- **Description:** Renders a realistic external e-commerce DOM structure (`.product-card`, `[data-testid="product-price"]`) to enable 100% deterministic, offline/online automated Playwright testing without anti-bot blocks.
