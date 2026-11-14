"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Controller handling HTTP requests for products and categories.
 */
class ProductController extends common_1.BaseController {
    productService;
    constructor(productService) {
        super();
        this.productService = productService;
    }
    getProducts = async (req, res) => {
        try {
            const result = await this.productService.listProducts(req.query);
            return this.sendPaginated(res, result.items, {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getProduct = async (req, res) => {
        try {
            const { idOrSlug } = req.params;
            const product = await this.productService.getProduct(idOrSlug);
            return this.sendSuccess(res, product);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    createProduct = async (req, res) => {
        try {
            const product = await this.productService.createProduct(req.body);
            return this.sendCreated(res, product);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await this.productService.updateProduct(id, req.body);
            return this.sendSuccess(res, product);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            return this.sendNoContent(res);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getCategories = async (_req, res) => {
        try {
            const categories = await this.productService.listCategories();
            return this.sendSuccess(res, categories);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    createCategory = async (req, res) => {
        try {
            const category = await this.productService.createCategory(req.body);
            return this.sendCreated(res, category);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map