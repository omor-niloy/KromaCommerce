# Auth & Identity API Specification

Base Path: `/api/v1/auth`

---

## Seeded Test Accounts & Default Credentials

For automated testing, local development, and manual QA, the database seeder creates two default accounts:

| Role | Account Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | System Administrator | `admin@kromacommerce.com` | *(Configured via `seed.ts`)* | Administrative console (`/admin`), Playwright crawler trigger, catalog mutations |
| **`CUSTOMER`** | Demo Customer | `customer@kromacommerce.com` | *(Configured via `seed.ts`)* | Standard storefront browsing, cart management, checkout, order history |

> [!NOTE]
> Passwords for default seed accounts are configured in `packages/database/src/seed.ts` for local testing. For production deployments, change these passwords or create administrator accounts with unique credentials.

---

## 1. Register User
- **Endpoint:** `POST /api/v1/auth/register`
- **Access:** Public
- **Description:** Registers a new user account with hashed password and returns access token + sets HTTP-only refresh cookie.

### Request Body
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "name": "Alex Johnson",
  "role": "CUSTOMER"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c7a8b66e-52f2-4c22-b5b4-d53b50f00001",
      "email": "customer@example.com",
      "name": "Alex Johnson",
      "role": "CUSTOMER",
      "createdAt": "2026-11-14T02:00:00.000Z",
      "updatedAt": "2026-11-14T02:00:00.000Z"
    },
    "accessToken": "eyJhbGciOi..."
  }
}
```
**Set-Cookie:** `refreshToken=eyJhbGciOi...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`

---

## 2. Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Access:** Public
- **Description:** Validates credentials, issues JWT access token, and sets HTTP-only refresh cookie.

### Request Body
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c7a8b66e-52f2-4c22-b5b4-d53b50f00001",
      "email": "customer@example.com",
      "name": "Alex Johnson",
      "role": "CUSTOMER"
    },
    "accessToken": "eyJhbGciOi..."
  }
}
```

---

## 3. Refresh Access Token
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Access:** Public (Requires valid Refresh Token in cookie or body)
- **Description:** Rotates refresh token and issues fresh 15-minute access token.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

---

## 4. Get Current User Profile
- **Endpoint:** `GET /api/v1/auth/me`
- **Access:** Authenticated (`Bearer <access_token>`)
- **Description:** Returns profile data for the authenticated session.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "c7a8b66e-52f2-4c22-b5b4-d53b50f00001",
    "email": "customer@kromacommerce.com",
    "name": "Alex Johnson",
    "role": "CUSTOMER",
    "createdAt": "2026-11-14T02:00:00.000Z",
    "updatedAt": "2026-11-14T02:00:00.000Z"
  }
}
```

---

## 5. Logout User
- **Endpoint:** `POST /api/v1/auth/logout`
- **Access:** Authenticated (`Bearer <access_token>`)
- **Description:** Revokes active refresh token in database and clears the HTTP-only cookie.
