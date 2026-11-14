import { PrismaClient, CompetitorPriceRecord } from '@ecommerce/database';
import { BaseRepository, PriceComparisonSummary } from '@ecommerce/common';
import { IScraperRepository } from './scraper.repository.interface';
/**
 * Prisma implementation of Scraper & Competitor Price Repository.
 */
export declare class ScraperRepository extends BaseRepository<CompetitorPriceRecord> implements IScraperRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findById(id: string): Promise<CompetitorPriceRecord | null>;
    findAll(filter?: Record<string, unknown>): Promise<CompetitorPriceRecord[]>;
    create(data: any): Promise<CompetitorPriceRecord>;
    savePriceRecord(data: {
        productId: string;
        competitorName: string;
        competitorUrl: string;
        price: number;
        currency: string;
        differencePercentage: number;
    }): Promise<CompetitorPriceRecord>;
    getComparisonSummary(productId: string): Promise<PriceComparisonSummary | null>;
    update(id: string, data: any): Promise<CompetitorPriceRecord>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=scraper.repository.d.ts.map