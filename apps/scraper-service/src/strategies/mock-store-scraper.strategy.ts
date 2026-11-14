import { ScrapedCompetitorData, BadRequestError } from '@ecommerce/common';
import { BaseScraperStrategy } from './base-scraper.strategy';

/**
 * Concrete scraper strategy automating price extraction from the Mock Competitor Store.
 */
export class MockCompetitorStoreScraperStrategy extends BaseScraperStrategy {
  public supports(url: string): boolean {
    return url.includes('mock-competitor') || url.includes('localhost') || url.includes('127.0.0.1');
  }

  public async scrape(targetUrl: string): Promise<ScrapedCompetitorData> {
    const { browser, context } = await this.createOptimizedContext();
    const page = await context.newPage();

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const titleSelector = '[data-testid="product-title"], h1.product-title, .title';
      const priceSelector = '[data-testid="product-price"], .price-tag, .price';
      const competitorSelector = '[data-testid="store-name"], .store-name';

      await page.waitForSelector(priceSelector, { timeout: 10000 });

      const rawTitle = await page.textContent(titleSelector);
      const rawPrice = await page.textContent(priceSelector);
      const rawCompetitor = await page.textContent(competitorSelector);

      if (!rawPrice) {
        throw new BadRequestError(`Price element not found at ${targetUrl}`);
      }

      const numericPrice = this.cleanPriceString(rawPrice);

      return {
        competitorName: rawCompetitor?.trim() || 'ElectroStore Express',
        competitorUrl: targetUrl,
        price: numericPrice,
        currency: 'usd',
        inStock: true,
        productTitle: rawTitle?.trim() || undefined,
        scrapedAt: new Date()
      };
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  }
}
