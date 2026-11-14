"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Service orchestrating product and category retrieval, creation, and mutations.
 */
class ProductService extends common_1.BaseService {
    productRepo;
    categoryRepo;
    constructor(productRepo, categoryRepo) {
        super();
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }
    async listProducts(query) {
        return this.productRepo.findWithFilters(query);
    }
    async getProduct(idOrSlug) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        let product = null;
        if (isUuid) {
            product = await this.productRepo.findDetailsById(idOrSlug);
        }
        if (!product) {
            product = await this.productRepo.findBySlug(idOrSlug);
        }
        if (!product) {
            throw new common_1.NotFoundError(`Product '${idOrSlug}' not found`);
        }
        return product;
    }
    async createProduct(input) {
        const existing = await this.productRepo.findBySlug(input.slug);
        if (existing) {
            throw new common_1.ConflictError(`Product with slug '${input.slug}' already exists`);
        }
        const category = await this.categoryRepo.findById(input.categoryId);
        if (!category) {
            throw new common_1.NotFoundError(`Category with ID '${input.categoryId}' not found`);
        }
        return this.productRepo.create({
            name: input.name,
            slug: input.slug,
            description: input.description,
            price: input.price,
            inventoryCount: input.inventoryCount,
            imageUrl: input.imageUrl,
            competitorUrl: input.competitorUrl || null,
            category: {
                connect: { id: input.categoryId }
            }
        });
    }
    async updateProduct(id, input) {
        const product = await this.productRepo.findById(id);
        if (!product) {
            throw new common_1.NotFoundError(`Product '${id}' not found`);
        }
        if (input.slug && input.slug !== product.slug) {
            const existing = await this.productRepo.findBySlug(input.slug);
            if (existing) {
                throw new common_1.ConflictError(`Product with slug '${input.slug}' already exists`);
            }
        }
        return this.productRepo.update(id, {
            ...(input.name ? { name: input.name } : {}),
            ...(input.slug ? { slug: input.slug } : {}),
            ...(input.description ? { description: input.description } : {}),
            ...(input.price !== undefined ? { price: input.price } : {}),
            ...(input.inventoryCount !== undefined ? { inventoryCount: input.inventoryCount } : {}),
            ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
            ...(input.competitorUrl !== undefined ? { competitorUrl: input.competitorUrl } : {}),
            ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {})
        });
    }
    async deleteProduct(id) {
        const product = await this.productRepo.findById(id);
        if (!product) {
            throw new common_1.NotFoundError(`Product '${id}' not found`);
        }
        await this.productRepo.delete(id);
    }
    async listCategories() {
        return this.categoryRepo.findAll();
    }
    async createCategory(input) {
        const existing = await this.categoryRepo.findBySlug(input.slug);
        if (existing) {
            throw new common_1.ConflictError(`Category with slug '${input.slug}' already exists`);
        }
        return this.categoryRepo.create({
            name: input.name,
            slug: input.slug,
            description: input.description || null
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map