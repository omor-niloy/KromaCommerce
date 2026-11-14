# Scraper & Price Intelligence Microservice (`apps/scraper-service`)

## 1. Role & Purpose
The Scraper microservice is an autonomous price intelligence crawler that monitors competitor storefront prices and generates comparison analytics using headless browser automation.

## 2. Port & Configuration
- **Port:** `8004`
- **Environment Variables:**
  - `PORT`: Service port (default: 8004)
  - `DATABASE_URL`: PostgreSQL connection string

## 3. Headless Playwright Worker & Memory Optimization
To prevent Out-Of-Memory (OOM) errors on 512MB free-tier cloud containers (e.g. Render / Koyeb), Playwright is configured with strict resource constraint flags:
- `--no-sandbox`
- `--disable-setuid-sandbox`
- `--disable-dev-shm-usage`
- `--disable-gpu`
- `--single-process`

## 4. Strategy Pattern for Web Scraping
- **Abstraction:** `IScraperStrategy` interface defining:
  - `supports(url: string): boolean`
  - `scrape(targetUrl: string): Promise<ScrapedCompetitorData>`
- **Concrete Strategies:**
  - `MockCompetitorStoreScraperStrategy`: Automates extraction from the built-in mock competitor storefront (`/mock-competitor/products/:item`). Guarantees 100% deterministic test execution in CI and offline environments without Cloudflare/CAPTCHA hurdles.
  - `GenericWebScraperStrategy`: General-purpose DOM extractor matching standard e-commerce microdata and price selectors.
- **Strategy Manager:** `ScraperStrategyManager` dynamically routes each product's competitor URL to the matching strategy.

## 5. Built-in Mock Competitor Store
The service serves a realistic e-commerce HTML DOM at `/mock-competitor/products/:item` to allow Playwright to execute real headless browser page navigation, DOM inspection, and selector queries without external network dependencies.
