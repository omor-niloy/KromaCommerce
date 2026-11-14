# KromaCommerce

> **Enterprise-Grade Microservices E-Commerce Platform with Autonomous Playwright Competitor Price Intelligence**

KromaCommerce is a distributed, full-stack e-commerce system built with strict Object-Oriented Programming (OOP) principles, automated price intelligence, robust testing pyramid (Unit, Acceptance, and Playwright E2E), and zero-bias dual-agent QA architecture.

Engineered to run seamlessly in **Multi-Container Microservices Mode** (Docker Compose) and **Consolidated Free-Tier Container Mode** for 100% free cloud deployment on **Vercel** + **Render / Koyeb** + **Neon / Supabase**.

---

## 1. System Topology & Architecture

```
                       [ Next.js 15 App Router Frontend ]
                                  (apps/web)
                                       │
                                       ▼ (Port 8000)
                           [ Express.js API Gateway ]
                                 (apps/gateway)
                                       │
      ┌──────────────────┬─────────────┴───────────────┬──────────────────┐
      ▼                  ▼                             ▼                  ▼
[ Auth Service ]  [ Catalog Service ]          [ Order Service ]   [ Scraper Service ]
  (Port 8001)        (Port 8002)                  (Port 8003)         (Port 8004)
  • OAuth 2.0        • Product Search             • Stripe Sessions   • Playwright Headless
  • JWT Rotation     • Multi-facet Filters        • Mock Gateway      • Competitor Price Feed
  • RBAC             • Inventory Ledger           • Signed Webhooks   • Historical Records
```

---

## 2. Microservices Breakdown

| Microservice | Directory | Port | Responsibilities | Key Design Patterns |
| :--- | :--- | :---: | :--- | :--- |
| **API Gateway** | `apps/gateway` | `8000` | Ingress, Rate Limiting, Helmet CSP, Reverse Proxy Routing | Facade, Reverse Proxy |
| **Auth Service** | `apps/auth-service` | `8001` | Password Hashing, JWT Rotation, Cookie Auth, RBAC | Controller-Service-Repo |
| **Catalog Service** | `apps/catalog-service` | `8002` | Products, Categories, Inventory, Filtering & Search | Repository Pattern |
| **Order Service** | `apps/order-service` | `8003` | Cart checkout, Stripe checkout sessions, Webhook verification | **Strategy Pattern** (`IPaymentGateway`) |
| **Scraper Service** | `apps/scraper-service` | `8004` | Headless Playwright worker, competitor crawling, price tracking | **Strategy Pattern** (`IScraperStrategy`) |
| **Web Client** | `apps/web` | `3000` | Next.js 15 App Router, Tailwind CSS, Lucide icons, Zustand | Component / Store |

---

## 3. Core Software Engineering Standards

1. **Object-Oriented Programming (OOP):**
   - Class-based architecture across all services: `BaseController`, `BaseService`, `BaseRepository<T>`.
   - Explicit TypeScript interface contracts (`IProductRepository`, `IOrderRepository`, `IAuthService`, `IPaymentGateway`, `IScraperStrategy`).
   - Dependency Injection via class constructors.
2. **Strategy Pattern:**
   - **Payment Gateway:** `StripePaymentGateway` (production/test mode) and `MockPaymentGateway` (zero-latency deterministic testing for CI/E2E).
   - **Web Scraper:** `MockCompetitorStoreScraperStrategy` (deterministic offline/online crawler) and `GenericWebScraperStrategy`.
3. **Frontend UI Aesthetics:**
   - **Strictly No Emojis:** All iconography utilizes clean vector SVG icons from `lucide-react`.
   - **Pure Colors Only:** Crisp, flat solid colors (`#000000`, `#ffffff`, pure saturated accents) without gradients or muted pastels.
4. **Dual-Agent Zero-Bias Testing Architecture (Rule 7):**
   - `DevAgent` authors implementation, architecture, and documentation.
   - `TestAgent` independently authors adversarial Unit, Supertest Acceptance, and Playwright E2E browser tests based strictly on `/docs` specifications.
5. **Version Control Governance:**
   - **Agent Will Not Commit:** The AI assistant never commits or pushes to git. All git commits and tagging remain exclusively under the command of the human developer.

---

## 4. Documentation Index

All architectural contracts and service specifications are documented in the `/docs` directory:
- [`/docs/architecture.md`](docs/architecture.md): System topology, data flow, and design patterns.
- [`/docs/deployment.md`](docs/deployment.md): Complete guide to 100% free tier hosting (Vercel + Render + Neon).
- [`/docs/testing.md`](docs/testing.md): Automated testing pyramid and execution instructions.
- [`/docs/api/auth.md`](docs/api/auth.md): Auth & Identity REST API contracts.
- [`/docs/api/catalog.md`](docs/api/catalog.md): Catalog, Products, and Categories contracts.
- [`/docs/api/orders.md`](docs/api/orders.md): Order creation, checkout, and webhook contracts.
- [`/docs/api/scraper.md`](docs/api/scraper.md): Competitor price intelligence and mock store contracts.
- [`/docs/api/gateway.md`](docs/api/gateway.md): Gateway rate limiting and reverse proxy specifications.
- [`/docs/services/`](docs/services/): Dedicated architectural documents for each microservice.

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js `v18.x` or later
- npm `v10.x` or later
- Docker & Docker Compose (optional for local multi-container testing)

### Installation
```bash
# 1. Install all monorepo dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Generate Prisma client & build packages
npm run db:generate
npm run build
```

### Running Locally with Hot-Reload (1-Command Startup)
```bash
# Start BOTH Backend API Gateway & Next.js Frontend concurrently with full hot-reloading:
npm run dev

# Or start services individually:
npm run dev:gateway    # API Gateway on port 8000 with tsx watch
npm run dev:web        # Next.js Frontend on port 3000 with Fast Refresh
npm run dev:services   # Run all 5 microservices as separate processes concurrently

# Option C: Multi-Container Docker Compose
docker compose up --build
```

### Seeded Test Accounts (Local Testing Only)
| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **`ADMIN`** | `admin@kromacommerce.com` | *(Configured in `packages/database/src/seed.ts`)* | Admin Console (`/admin`), Playwright crawler trigger, catalog mutations |
| **`CUSTOMER`** | `customer@kromacommerce.com` | *(Configured in `packages/database/src/seed.ts`)* | Storefront browsing, cart management, checkout, order history |

---

## 6. Automated Testing Suite

```bash
# Run Unit Tests (Vitest)
npm run test:unit

# Run API Acceptance Tests (Supertest)
npm run test:acceptance

# Run Playwright E2E Browser Automation
npm run test:e2e
```

---

## 7. License

MIT License. Designed and built with enterprise standards.
