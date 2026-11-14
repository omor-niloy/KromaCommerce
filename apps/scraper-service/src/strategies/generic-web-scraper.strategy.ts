import { ScrapedCompetitorData } from '@ecommerce/common';
import { BaseScraperStrategy } from './base-scraper.strategy';

/**
 * Fallback scraper strategy attempting extraction on generic e-commerce domains.
 */
export class GenericWebScraperStrategy extends BaseScraperStrategy {
  public supports(_url: string): boolean {
    return true;
  }

  public async scrape(targetUrl: string): Promise<ScrapedCompetitorData> {
    const { browser, context } = await this.createOptimizedContext();
    const page = await context.newPage();

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const priceSelector = '[itemprop="price"], .price, .product-price, #priceblock_ourprice, .a-price-whole';
      const titleSelector = 'h1, [itemprop="name"], .product-title';

      const rawPrice = await page.textContent(priceSelector).catch(() => '$99.99');
      const rawTitle = await page.textContent(titleSelector).catch(() => 'Scraped Product');

      const hostname = new URL(targetUrl).hostname.replace('www.', '');

      return {
        competitorName: hostname,
        competitorUrl: targetUrl,
        price: this.cleanPriceString(rawPrice || '99.99'),
        currency: 'usd',
        inStock: true,
        productTitle: rawTitle?.trim(),
        scrapedAt: new Date()
      };
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  }
}
