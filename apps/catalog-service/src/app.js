"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@ecommerce/common");
const database_1 = require("@ecommerce/database");
const product_repository_1 = require("./repositories/product.repository");
const product_service_1 = require("./services/product.service");
const product_controller_1 = require("./controllers/product.controller");
const product_routes_1 = require("./routes/product.routes");
/**
 * Express Application setup class for Catalog microservice.
 */
class CatalogApp {
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
        const productRepo = new product_repository_1.ProductRepository(prisma);
        const categoryRepo = new product_repository_1.CategoryRepository(prisma);
        const productService = new product_service_1.ProductService(productRepo, categoryRepo);
        const productController = new product_controller_1.ProductController(productService);
        const catalogRouter = new product_routes_1.CatalogRouter(productController);
        this.app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok', service: 'catalog-service' });
        });
        this.app.use('/api/v1', catalogRouter.getRouter());
    }
    setupErrorHandling() {
        this.app.use(common_1.ErrorHandlerMiddleware.handle);
    }
}
exports.CatalogApp = CatalogApp;
//# sourceMappingURL=app.js.map