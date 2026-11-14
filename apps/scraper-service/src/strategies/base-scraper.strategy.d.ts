import { Browser, BrowserContext } from 'playwright';
import { IScraperStrategy, ScrapedCompetitorData } from '@ecommerce/common';
/**
 * Abstract Base Scraper Strategy handling Playwright headless browser lifecycle with memory optimization.
 */
export declare abstract class BaseScraperStrategy implements IScraperStrategy {
    abstract supports(url: string): boolean;
    abstract scrape(targetUrl: string): Promise<ScrapedCompetitorData>;
    /**
     * Spawns an isolated, memory-optimized headless Chromium browser context.
     */
    protected createOptimizedContext(): Promise<{
        browser: Browser;
        context: BrowserContext;
    }>;
    /**
     * Parses cleaned numeric float value from scraped price text strings (e.g. '$199.99' -> 199.99).
     */
    protected cleanPriceString(rawPrice: string): number;
}
//# sourceMappingURL=base-scraper.strategy.d.ts.map