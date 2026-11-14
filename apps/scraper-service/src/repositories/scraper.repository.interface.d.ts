import { IRepository, PriceComparisonSummary } from '@ecommerce/common';
import { CompetitorPriceRecord } from '@ecommerce/database';
/**
 * Interface contract for Competitor Price persistence and aggregation operations.
 */
export interface IScraperRepository extends IRepository<CompetitorPriceRecord> {
    savePriceRecord(data: {
        productId: string;
        competitorName: string;
        competitorUrl: string;
        price: number;
        currency: string;
        differencePercentage: number;
    }): Promise<CompetitorPriceRecord>;
    getComparisonSummary(productId: string): Promise<PriceComparisonSummary | null>;
}
//# sourceMappingURL=scraper.repository.interface.d.ts.map