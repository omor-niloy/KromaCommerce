import { chromium, Browser, BrowserContext } from 'playwright';
import { IScraperStrategy, ScrapedCompetitorData } from '@ecommerce/common';

/**
 * Abstract Base Scraper Strategy handling Playwright headless browser lifecycle with memory optimization.
 */
export abstract class BaseScraperStrategy implements IScraperStrategy {
  public abstract supports(url: string): boolean;
  public abstract scrape(targetUrl: string): Promise<ScrapedCompetitorData>;

  /**
   * Spawns an isolated, memory-optimized headless Chromium browser context.
   */
  protected async createOptimizedContext(): Promise<{ browser: Browser; context: BrowserContext }> {
    const browser = await chromium.launch({
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
  protected cleanPriceString(rawPrice: string): number {
    const cleaned = rawPrice.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
