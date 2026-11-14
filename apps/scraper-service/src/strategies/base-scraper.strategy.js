"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScraperStrategy = void 0;
const playwright_1 = require("playwright");
/**
 * Abstract Base Scraper Strategy handling Playwright headless browser lifecycle with memory optimization.
 */
class BaseScraperStrategy {
    /**
     * Spawns an isolated, memory-optimized headless Chromium browser context.
     */
    async createOptimizedContext() {
        const browser = await playwright_1.chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process'
            ]
        });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 }
        });
        return { browser, context };
    }
    /**
     * Parses cleaned numeric float value from scraped price text strings (e.g. '$199.99' -> 199.99).
     */
    cleanPriceString(rawPrice) {
        const cleaned = rawPrice.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }
}
exports.BaseScraperStrategy = BaseScraperStrategy;
//# sourceMappingURL=base-scraper.strategy.js.map