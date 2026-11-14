import { BaseService, PriceComparisonSummary } from '@ecommerce/common';
import { PrismaClient } from '@ecommerce/database';
import { IScraperRepository } from '../repositories/scraper.repository.interface';
import { ScraperStrategyManager } from '../strategies/scraper-strategy.manager';
export interface ScrapeSyncResult {
    productId: string;
    productName: string;
    ourPrice: number;
    competitorPrice: number;
    competitorName: string;
    differencePercentage: number;
    scrapedAt: Date;
}
/**
 * Service managing competitor price scraping jobs and comparison analytics.
 */
export declare class ScraperService extends BaseService {
    private readonly scraperRepo;
    private readonly db;
    private readonly strategyManager;
    constructor(scraperRepo: IScraperRepository, db: PrismaClient, strategyManager?: ScraperStrategyManager);
    syncProduct(productId: string): Promise<ScrapeSyncResult>;
    syncAllProducts(limit?: number): Promise<ScrapeSyncResult[]>;
    getComparison(productId: string): Promise<PriceComparisonSummary>;
}
//# sourceMappingURL=scraper.service.d.ts.map