"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Controller handling competitor price extraction requests and mock competitor page rendering.
 */
class ScraperController extends common_1.BaseController {
    scraperService;
    constructor(scraperService) {
        super();
        this.scraperService = scraperService;
    }
    syncProduct = async (req, res) => {
        try {
            const { productId } = req.params;
            const result = await this.scraperService.syncProduct(productId);
            return this.sendSuccess(res, result);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    syncAll = async (req, res) => {
        try {
            const limit = req.body?.limit ? Number(req.body.limit) : 10;
            const results = await this.scraperService.syncAllProducts(limit);
            return this.sendSuccess(res, {
                totalSynced: results.length,
                items: results
            });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getComparison = async (req, res) => {
        try {
            const { productId } = req.params;
            const comparison = await this.scraperService.getComparison(productId);
            return this.sendSuccess(res, comparison);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    renderMockCompetitorPage = (req, res) => {
        const { item } = req.params;
        const mockPrices = {
            headphones: { title: 'MegaAudio Wireless Pro Noise-Cancelling Headphones', price: '$229.99' },
            monitor: { title: 'Apex 32-inch 4K UHD 144Hz IPS Gaming Monitor', price: '$389.99' },
            keyboard: { title: 'Titan Tactile Tri-Mode Mechanical Keyboard', price: '$149.99' },
            mouse: { title: 'Viper Ultralight 26K DPI Precision Gaming Mouse', price: '$89.99' },
            smartwatch: { title: 'Chrono Titanium AMOLED Smartwatch with ECG', price: '$279.99' },
            speaker: { title: 'BoomBox 360 Rugged Waterproof Bluetooth Speaker', price: '$169.99' }
        };
        const target = (item && mockPrices[item.toLowerCase()]) || {
            title: 'ElectroStore Express Competitor Item',
            price: '$199.99'
        };
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${target.title} - ElectroStore Express</title>
  <style>
    body { font-family: sans-serif; background-color: #ffffff; color: #000000; padding: 2rem; }
    .product-card { border: 2px solid #000000; padding: 1.5rem; max-width: 500px; }
    .store-name { font-weight: bold; font-size: 1.2rem; }
    .product-title { font-size: 1.5rem; margin: 1rem 0; }
    .product-price { font-size: 2rem; font-weight: 800; color: #000000; }
    .stock-badge { background-color: #000000; color: #ffffff; padding: 0.25rem 0.5rem; }
  </style>
</head>
<body>
  <div class="product-card">
    <div class="store-name" data-testid="store-name">ElectroStore Express</div>
    <h1 class="product-title" data-testid="product-title">${target.title}</h1>
    <div class="product-price" data-testid="product-price">${target.price}</div>
    <p class="stock-badge">In Stock - Ready to Ship</p>
  </div>
</body>
</html>`;
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    };
}
exports.ScraperController = ScraperController;
//# sourceMappingURL=scraper.controller.js.map