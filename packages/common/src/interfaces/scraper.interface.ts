/**
 * Data extracted by a competitor scraper strategy.
 */
export interface ScrapedCompetitorData {
  competitorName: string;
  competitorUrl: string;
  price: number;
  currency: string;
  inStock: boolean;
  productTitle?: string;
  scrapedAt: Date;
}

/**
 * Historical competitor price record domain representation.
 */
export interface CompetitorPriceRecordModel {
  id: string;
  productId: string;
  competitorName: string;
  competitorUrl: string;
  price: number;
  currency: string;
  differencePercentage: number;
  createdAt: Date;
}

/**
 * Real-time price comparison summary for a product.
 */
export interface PriceComparisonSummary {
  productId: string;
  productName: string;
  ourPrice: number;
  lowestCompetitorPrice: number | null;
  averageCompetitorPrice: number | null;
  differencePercentage: number | null;
  records: CompetitorPriceRecordModel[];
}

/**
 * Strategy interface abstraction for web scrapers.
 */
export interface IScraperStrategy {
  /**
   * Identifies whether this strategy handles the given URL.
   */
  supports(url: string): boolean;

  /**
   * Executes scraping against target URL using Playwright browser context.
   */
  scrape(targetUrl: string): Promise<ScrapedCompetitorData>;
}
