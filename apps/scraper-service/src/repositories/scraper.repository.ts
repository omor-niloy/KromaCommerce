import { PrismaClient, CompetitorPriceRecord } from '@ecommerce/database';
import { BaseRepository, PriceComparisonSummary } from '@ecommerce/common';
import { IScraperRepository } from './scraper.repository.interface';

/**
 * Prisma implementation of Scraper & Competitor Price Repository.
 */
export class ScraperRepository extends BaseRepository<CompetitorPriceRecord> implements IScraperRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    super();
    this.db = db;
  }

  public async findById(id: string): Promise<CompetitorPriceRecord | null> {
    return this.db.competitorPriceRecord.findUnique({
      where: { id }
    });
  }

  public async findAll(filter?: Record<string, unknown>): Promise<CompetitorPriceRecord[]> {
    return this.db.competitorPriceRecord.findMany({
      where: filter as any,
      orderBy: { createdAt: 'desc' }
    });
  }

  public async create(data: any): Promise<CompetitorPriceRecord> {
    return this.savePriceRecord(data);
  }

  public async savePriceRecord(data: {
    productId: string;
    competitorName: string;
    competitorUrl: string;
    price: number;
    currency: string;
    differencePercentage: number;
  }): Promise<CompetitorPriceRecord> {
    return this.db.competitorPriceRecord.create({
      data: {
        productId: data.productId,
        competitorName: data.competitorName,
        competitorUrl: data.competitorUrl,
        price: data.price,
        currency: data.currency,
        differencePercentage: data.differencePercentage
      }
    });
  }

  public async getComparisonSummary(productId: string): Promise<PriceComparisonSummary | null> {
    const product = await this.db.product.findUnique({
      where: { id: productId },
      include: {
        competitorPriceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return null;
    }

    const records = product.competitorPriceRecords;
    if (records.length === 0) {
      return {
        productId: product.id,
        productName: product.name,
        ourPrice: product.price,
        lowestCompetitorPrice: null,
        averageCompetitorPrice: null,
        differencePercentage: null,
        records: []
      };
    }

    const prices = records.map((r: any) => r.price);
    const lowest = Math.min(...prices);
    const avg = Math.round((prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length) * 100) / 100;
    const diff = Math.round(((lowest - product.price) / product.price) * 10000) / 100;

    return {
      productId: product.id,
      productName: product.name,
      ourPrice: product.price,
      lowestCompetitorPrice: lowest,
      averageCompetitorPrice: avg,
      differencePercentage: diff,
      records
    };
  }

  public async update(id: string, data: any): Promise<CompetitorPriceRecord> {
    return this.db.competitorPriceRecord.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.db.competitorPriceRecord.delete({
      where: { id }
    });
    return true;
  }
}
