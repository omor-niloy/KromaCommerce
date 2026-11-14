"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@ecommerce/common");
const scraper_strategy_manager_1 = require("../strategies/scraper-strategy.manager");
/**
 * Service managing competitor price scraping jobs and comparison analytics.
 */
class ScraperService extends common_1.BaseService {
    scraperRepo;
    db;
    strategyManager;
    constructor(scraperRepo, db, strategyManager = new scraper_strategy_manager_1.ScraperStrategyManager()) {
        super();
        this.scraperRepo = scraperRepo;
        this.db = db;
        this.strategyManager = strategyManager;
    }
    async syncProduct(productId) {
        const product = await this.db.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new common_1.NotFoundError(`Product '${productId}' not found`);
        }
        if (!product.competitorUrl) {
            throw new common_1.BadRequestError(`Product '${product.name}' has no competitor URL configured`);
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
    async syncAllProducts(limit = 10) {
        const products = await this.db.product.findMany({
            where: {
                competitorUrl: { not: null }
            },
            take: limit
        });
        const results = [];
        for (const prod of products) {
            try {
                const res = await this.syncProduct(prod.id);
                results.push(res);
            }
            catch (err) {
                console.warn(`Failed to sync competitor price for ${prod.name}:`, err);
            }
        }
        return results;
    }
    async getComparison(productId) {
        const summary = await this.scraperRepo.getComparisonSummary(productId);
        if (!summary) {
            throw new common_1.NotFoundError(`Product '${productId}' not found`);
        }
        return summary;
    }
}
exports.ScraperService = ScraperService;
//# sourceMappingURL=scraper.service.js.map