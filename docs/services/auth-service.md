# Auth & Identity Microservice (`apps/auth-service`)

## 1. Role & Purpose
The Auth microservice encapsulates user identity management, credential hashing, Role-Based Access Control (RBAC), and session token rotation.

## 2. Port & Configuration
- **Port:** `8001`
- **Environment Variables:**
  - `PORT`: Service port (default: 8001)
  - `DATABASE_URL`: PostgreSQL connection string with PgBouncer pooling
  - `JWT_ACCESS_SECRET`: 256-bit secret for signing access tokens
  - `JWT_REFRESH_SECRET`: 256-bit secret for signing refresh tokens
  - `JWT_ACCESS_EXPIRY`: Lifespan of access token (e.g. `15m`)
  - `JWT_REFRESH_EXPIRY`: Lifespan of refresh token (e.g. `7d`)

## 3. Class-Based Architecture
- **Controller:** `AuthController extends BaseController`
  - Encapsulates HTTP request unwrapping, calling `IAuthService`, and setting `httpOnly` secure cookies.
- **Service:** `AuthService extends BaseService implements IAuthService`
  - Encapsulates password comparison (`PasswordHasher`), token generation (`JwtTokenManager`), and refresh token rotation logic.
- **Repository:** `UserRepository extends BaseRepository<User> implements IUserRepository`
  - Encapsulates database queries via Prisma ORM.

## 4. Security Highlights
- Passwords hashed using `bcryptjs` with 10 salt rounds.
- Refresh tokens are hashed before storing in the database (`refreshTokenHash`), preventing token theft even if database read access is compromised.
- Refresh tokens are delivered to browsers exclusively via `httpOnly`, `Secure` (in prod), `SameSite=Strict` cookies.

---

## 5. Seeded Test Accounts & Default Credentials

The database seeder (`packages/database/src/seed.ts`) populates initial default accounts for local automated testing and manual QA:

| Role | Account Name | Default Email | Password | Privileges & Access |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | System Administrator | `admin@kromacommerce.com` | *(Configured in `seed.ts`)* | Full administrative clearance, `/admin` console, Playwright crawler triggers, product & category mutations |
| **`CUSTOMER`** | Demo Customer | `customer@kromacommerce.com` | *(Configured in `seed.ts`)* | Standard customer access, storefront catalog browsing, cart operations, order creation & checkout |

> [!IMPORTANT]
> The passwords for default seed accounts are configured directly in `packages/database/src/seed.ts` for testing. For production, update these credentials or create new accounts with strong passwords.

