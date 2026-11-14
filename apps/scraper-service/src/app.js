"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@ecommerce/common");
const database_1 = require("@ecommerce/database");
const scraper_repository_1 = require("./repositories/scraper.repository");
const scraper_service_1 = require("./services/scraper.service");
const scraper_controller_1 = require("./controllers/scraper.controller");
const scraper_routes_1 = require("./routes/scraper.routes");
/**
 * Express Application setup class for Scraper & Price Intelligence microservice.
 */
class ScraperApp {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
            credentials: true
        }));
        this.app.use(express_1.default.json());
    }
    setupRoutes() {
        const prisma = database_1.DatabaseConnection.getInstance();
        const scraperRepo = new scraper_repository_1.ScraperRepository(prisma);
        const scraperService = new scraper_service_1.ScraperService(scraperRepo, prisma);
        const scraperController = new scraper_controller_1.ScraperController(scraperService);
        const scraperRouter = new scraper_routes_1.ScraperRouter(scraperController);
        this.app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok', service: 'scraper-service' });
        });
        this.app.use('/', scraperRouter.getRouter());
    }
    setupErrorHandling() {
        this.app.use(common_1.ErrorHandlerMiddleware.handle);
    }
}
exports.ScraperApp = ScraperApp;
//# sourceMappingURL=app.js.map