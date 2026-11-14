# KromaCommerce

[![Storefront Live](https://img.shields.io/badge/Storefront-Live%20on%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kromacommercevercel.vercel.app/)
[![API Gateway Live](https://img.shields.io/badge/API%20Gateway-Live%20on%20Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://kromacommerce.onrender.com/health)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Enterprise-Grade Distributed E-Commerce Monorepo with Autonomous Playwright Competitor Price Intelligence & Multi-Mode Cloud Architecture.**

---

## 🌐 Live Deployments

| Component | Platform | Live URL | Description |
| :--- | :--- | :--- | :--- |
| **Storefront Client** | **Vercel** (Edge) | [https://kromacommercevercel.vercel.app/](https://kromacommercevercel.vercel.app/) | Next.js 14 App Router, Tailwind CSS, Zustand, Lucide vector icons |
| **API Gateway & Backend** | **Render** (Cloud) | [https://kromacommerce.onrender.com/](https://kromacommerce.onrender.com/health) | Express.js API Gateway, Helmet CSP, Sliding-window rate limiters |
| **Relational Database** | **Neon** (Singapore) | *Serverless AWS ap-southeast-1* | PostgreSQL with PgBouncer connection pooling & Prisma ORM |

### 🔑 Demo Accounts for Live Testing

You can use these seeded credentials directly in the live storefront:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **`ADMIN`** | `admin@kromacommerce.com` | `Admin123!` | Access to Admin Console ([/admin](https://kromacommercevercel.vercel.app/admin)), trigger Playwright competitor price sync, view price intelligence |
| **`CUSTOMER`** | `customer@kromacommerce.com` | `Customer123!` | Storefront catalog browsing, multi-facet filtering, cart drawer, multi-step shipping checkout |

---

## 1. System Topology & Architecture

```
                       [ Next.js 14 App Router Frontend ]
                          (https://kromacommercevercel.vercel.app)
                                       │
                                       ▼ (HTTPS)
                           [ Express.js API Gateway ]
                        (https://kromacommerce.onrender.com)
                                       │
      ┌──────────────────┬─────────────┴───────────────┬──────────────────┐
      ▼                  ▼                             ▼                  ▼
[ Auth Service ]  [ Catalog Service ]          [ Order Service ]   [ Scraper Service ]
  • OAuth 2.0        • Product Search             • Checkout Flow     • Playwright Headless
  • JWT Rotation     • Multi-facet Filters        • Strategy Pattern  • Competitor Price Feed
  • RBAC             • Inventory Ledger           • Signed Webhooks   • Historical Records
      │                  │                             │                  │
      └──────────────────┴─────────────┬───────────────┴──────────────────┘
                                       ▼
                       [ Neon Serverless PostgreSQL ]
                       (PgBouncer Connection Pooling)
```

---

## 2. Microservices Breakdown

| Microservice | Directory | Port | Responsibilities | Key Design Patterns |
| :--- | :--- | :---: | :--- | :--- |
| **API Gateway** | `apps/gateway` | `8000` | Ingress, Rate Limiting, Helmet CSP, Reverse Proxy Routing | Facade, Reverse Proxy |
| **Auth Service** | `apps/auth-service` | `8001` | Password Hashing, JWT Rotation, Cookie Auth, RBAC | Controller-Service-Repository |
| **Catalog Service** | `apps/catalog-service` | `8002` | Products, Categories, Inventory, Filtering & Search | Repository Pattern |
| **Order Service** | `apps/order-service` | `8003` | Cart checkout, Shipping validation, Webhook verification | **Strategy Pattern** (`IPaymentGateway`) |
| **Scraper Service** | `apps/scraper-service` | `8004` | Headless Playwright worker, competitor crawling, price tracking | **Strategy Pattern** (`IScraperStrategy`) |
| **Web Client** | `apps/web` | `3000` | Next.js 14 App Router, Tailwind CSS, Lucide icons, Zustand | Component / Store |

---

## 3. Key Engineering Highlights (CV / Portfolio)

- **Class-Based Object-Oriented Architecture (OOP):** Built with strict encapsulation, dependency injection via constructors, and explicit TypeScript interfaces (`IProductRepository`, `IOrderRepository`, `IAuthService`, `IPaymentGateway`, `IScraperStrategy`).
- **Design Patterns in Practice:**
  - **Strategy Pattern:** Used for payment gateways (`StripePaymentGateway` and deterministic `MockPaymentGateway`) and web crawlers (`MockCompetitorStoreScraperStrategy` and `GenericWebScraperStrategy`).
  - **Repository Pattern:** Fully decouples business logic from persistence queries across all microservices.
  - **Singleton Pattern:** Manages database connection pool lifecycles and Redis/in-memory rate limit stores.
- **Autonomous Headless Browser Intelligence:** Embedded Playwright scraper crawls competitor catalogs in real time, computing price variance percentages and tracking historical price fluctuations.
- **Defense-in-Depth Security:**
  - Dual JWT token authentication: short-lived access tokens (15m) paired with rotating HTTP-only, `SameSite=Strict` refresh cookies.
  - Multi-tier sliding-window rate limiters protecting authentication routes from brute-force attempts.
  - Helmet Content-Security-Policy with strict frame and script boundaries.
- **Dual-Mode Cloud Architecture:** Operates both as **Distributed Microservices** (via Docker Compose) and in **Consolidated Mode** to run within single-instance free cloud tiers (Render + Vercel + Neon).
- **Dual-Agent Zero-Bias Testing Architecture:** 104+ Vitest unit & integration tests and Playwright E2E browser test automation authored by an independent test agent.

---

## 4. Documentation Index

Detailed architectural contracts, API specifications, and service documentation reside in [`/docs`](docs/):

- [`/docs/architecture.md`](docs/architecture.md) — Comprehensive system topology, data flow, and design pattern implementation.
- [`/docs/deployment.md`](docs/deployment.md) — Free cloud deployment setup for Vercel, Render, and Neon.
- [`/docs/testing.md`](docs/testing.md) — Testing strategy, test pyramid breakdown, and execution commands.
- [`/docs/api/auth.md`](docs/api/auth.md) — Authentication, registration, and token rotation API contracts.
- [`/docs/api/catalog.md`](docs/api/catalog.md) — Product search, filtering, and category contracts.
- [`/docs/api/orders.md`](docs/api/orders.md) — Checkout, order state machine, and webhook verification contracts.
- [`/docs/api/scraper.md`](docs/api/scraper.md) — Competitor price monitoring and mock crawler contracts.
- [`/docs/api/gateway.md`](docs/api/gateway.md) — Ingress routing and rate limiting rules.
- [`/docs/services/`](docs/services/) — Dedicated architectural deep dives for each individual microservice.

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js `v18.x` or later
- npm `v10.x` or later
- Docker & Docker Compose (optional for local multi-container mode)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/omor-niloy/KromaCommerce.git
cd KromaCommerce

# Install dependencies across all monorepo packages
npm install

# Copy environment template
cp .env.example .env

# Generate Prisma client and compile packages
npm run db:generate
npm run build
```

### 2. Running Locally (Single Command Hot-Reload)
```bash
# Start API Gateway (port 8000) & Next.js Frontend (port 3000) concurrently:
npm run dev

# Or run via Multi-Container Docker Compose:
docker compose up --build
```

---

## 6. Automated Testing Suite

```bash
# Run Unit Tests (Vitest)
npm run test:unit

# Run API Acceptance Tests (Supertest)
npm run test:acceptance

# Run End-to-End Browser Tests (Playwright)
npm run test:e2e
```

---

## 7. License

MIT License. Designed and engineered with enterprise production standards.
