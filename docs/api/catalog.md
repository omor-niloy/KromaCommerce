# Catalog & Products API Specification

Base Path: `/api/v1`

---

## 1. List Products (With Filters & Pagination)
- **Endpoint:** `GET /api/v1/products`
- **Access:** Public
- **Query Parameters:**
  - `page` (optional, default: 1): Current page index
  - `limit` (optional, default: 10, max: 100): Number of items per page
  - `search` (optional): Case-insensitive keyword search matching title or description
  - `categorySlug` (optional): Filter products belonging to a specific category
  - `minPrice` (optional): Minimum price threshold
  - `maxPrice` (optional): Maximum price threshold
  - `sortBy` (optional, default: `createdAt`): `price` | `createdAt` | `name`
  - `sortOrder` (optional, default: `desc`): `asc` | `desc`

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "e58b16c4-1188-42f0-9b45-21d7821619a1",
      "name": "Kroma Noise-Cancelling Wireless Headphones",
      "slug": "kroma-noise-cancelling-headphones",
      "description": "Active noise cancellation with 40-hour battery life...",
      "price": 199.99,
      "inventoryCount": 45,
      "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "categoryId": "a3bb859a-2e66-414f-b52e-06a5b28291a1",
      "competitorUrl": "http://localhost:8004/mock-competitor/products/headphones",
      "category": {
        "id": "a3bb859a-2e66-414f-b52e-06a5b28291a1",
        "name": "Audio",
        "slug": "audio"
      },
      "competitorPriceRecords": [
        {
          "id": "76426462-cbbf-49f2-8c10-91c856758410",
          "competitorName": "ElectroStore Express",
          "price": 229.99,
          "differencePercentage": 15.0,
          "createdAt": "2026-11-14T02:00:00.000Z"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

---

## 2. Get Product By Slug or ID
- **Endpoint:** `GET /api/v1/products/:idOrSlug`
- **Access:** Public

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "e58b16c4-1188-42f0-9b45-21d7821619a1",
    "name": "Kroma Noise-Cancelling Wireless Headphones",
    "slug": "kroma-noise-cancelling-headphones",
    "description": "Active noise cancellation with 40-hour battery life...",
    "price": 199.99,
    "inventoryCount": 45,
    "imageUrl": "https://images.unsplash.com/...",
    "category": {
      "id": "...",
      "name": "Audio",
      "slug": "audio"
    },
    "competitorPriceRecords": [...]
  }
}
```

---

## 3. Create Product
- **Endpoint:** `POST /api/v1/products`
- **Access:** Admin only (`Bearer <access_token>`, Role: `ADMIN`)
- **Request Body:**
```json
{
  "name": "Kroma Smart Speaker",
  "slug": "kroma-smart-speaker",
  "description": "Voice-enabled room acoustic speaker.",
  "price": 129.99,
  "inventoryCount": 50,
  "imageUrl": "https://images.unsplash.com/photo-1545454675-3531b543be5d",
  "categoryId": "a3bb859a-2e66-414f-b52e-06a5b28291a1",
  "competitorUrl": "http://localhost:8004/mock-competitor/products/speaker"
}
```
- **Response:** `201 Created`

---

## 4. List Categories
- **Endpoint:** `GET /api/v1/categories`
- **Access:** Public
- **Response (200 OK):** Array of category models (`id`, `name`, `slug`, `description`).
