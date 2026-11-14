import { ScrapedCompetitorData } from '@ecommerce/common';
import { BaseScraperStrategy } from './base-scraper.strategy';
/**
 * Concrete scraper strategy automating price extraction from the Mock Competitor Store.
 */
export declare class MockCompetitorStoreScraperStrategy extends BaseScraperStrategy {
    supports(url: string): boolean;
    scrape(targetUrl: string): Promise<ScrapedCompetitorData>;
}
//# sourceMappingURL=mock-store-scraper.strategy.d.ts.map