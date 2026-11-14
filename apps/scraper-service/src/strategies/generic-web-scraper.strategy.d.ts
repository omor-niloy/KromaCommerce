import { ScrapedCompetitorData } from '@ecommerce/common';
import { BaseScraperStrategy } from './base-scraper.strategy';
/**
 * Fallback scraper strategy attempting extraction on generic e-commerce domains.
 */
export declare class GenericWebScraperStrategy extends BaseScraperStrategy {
    supports(_url: string): boolean;
    scrape(targetUrl: string): Promise<ScrapedCompetitorData>;
}
//# sourceMappingURL=generic-web-scraper.strategy.d.ts.map