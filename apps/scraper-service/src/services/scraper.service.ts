import {
  BaseService,
  PriceComparisonSummary,
  NotFoundError,
  BadRequestError
} from '@ecommerce/common';
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
export class ScraperService extends BaseService {
  private readonly scraperRepo: IScraperRepository;
  private readonly db: PrismaClient;
  private readonly strategyManager: ScraperStrategyManager;

  constructor(
    scraperRepo: IScraperRepository,
    db: PrismaClient,
    strategyManager: ScraperStrategyManager = new ScraperStrategyManager()
  ) {
    super();
    this.scraperRepo = scraperRepo;
    this.db = db;
    this.strategyManager = strategyManager;
  }

  public async syncProduct(productId: string): Promise<ScrapeSyncResult> {
    const product = await this.db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundError(`Product '${productId}' not found`);
    }

    if (!product.competitorUrl) {
      throw new BadRequestError(`Product '${product.name}' has no competitor URL configured`);
    }

    const strategy = this.strategyManager.resolveStrategy(product.competitorUrl);
    const scraped = await strategy.scrape(product.competitorUrl);

    const diff = Math.round(((scraped.price - product.price) / product.price) * 10000) / 100;

    await this.scraperRepo.savePriceRecord({
      productId: product.id,
      competitorName: scraped.competitorName,
      competitorUrl: product.competitorUrl,
      price: scraped.price,
      currency: scraped.currency,
      differencePercentage: diff
    });

    return {
      productId: product.id,
      productName: product.name,
      ourPrice: product.price,
      competitorPrice: scraped.price,
      competitorName: scraped.competitorName,
      differencePercentage: diff,
      scrapedAt: scraped.scrapedAt
    };
  }

  public async syncAllProducts(limit = 10): Promise<ScrapeSyncResult[]> {
    const products = await this.db.product.findMany({
      where: {
        competitorUrl: { not: null }
      },
      take: limit
    });

    const results: ScrapeSyncResult[] = [];
    for (const prod of products) {
      try {
        const res = await this.syncProduct(prod.id);
        results.push(res);
      } catch (err) {
        console.warn(`Failed to sync competitor price for ${prod.name}:`, err);
      }
    }

    return results;
  }

  public async getComparison(productId: string): Promise<PriceComparisonSummary> {
    const summary = await this.scraperRepo.getComparisonSummary(productId);
    if (!summary) {
      throw new NotFoundError(`Product '${productId}' not found`);
    }
    return summary;
  }
}
