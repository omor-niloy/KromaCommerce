"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperRepository = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Prisma implementation of Scraper & Competitor Price Repository.
 */
class ScraperRepository extends common_1.BaseRepository {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    async findById(id) {
        return this.db.competitorPriceRecord.findUnique({
            where: { id }
        });
    }
    async findAll(filter) {
        return this.db.competitorPriceRecord.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(data) {
        return this.savePriceRecord(data);
    }
    async savePriceRecord(data) {
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
    async getComparisonSummary(productId) {
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
        const prices = records.map((r) => r.price);
        const lowest = Math.min(...prices);
        const avg = Math.round((prices.reduce((sum, p) => sum + p, 0) / prices.length) * 100) / 100;
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
    async update(id, data) {
        return this.db.competitorPriceRecord.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await this.db.competitorPriceRecord.delete({
            where: { id }
        });
        return true;
    }
}
exports.ScraperRepository = ScraperRepository;
//# sourceMappingURL=scraper.repository.js.map