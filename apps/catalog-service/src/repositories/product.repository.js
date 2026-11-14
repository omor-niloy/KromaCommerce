"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = exports.ProductRepository = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Prisma implementation of Product Repository.
 */
class ProductRepository extends common_1.BaseRepository {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    async findById(id) {
        return this.db.product.findUnique({
            where: { id }
        });
    }
    async findDetailsById(id) {
        return this.db.product.findUnique({
            where: { id },
            include: {
                category: true,
                competitorPriceRecords: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
    }
    async findBySlug(slug) {
        return this.db.product.findUnique({
            where: { slug },
            include: {
                category: true,
                competitorPriceRecords: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
    }
    async findAll() {
        return this.db.product.findMany();
    }
    async findWithFilters(filters) {
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        if (filters.categorySlug) {
            where.category = {
                slug: filters.categorySlug
            };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }
        const orderBy = {};
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder || 'desc';
        orderBy[sortBy] = sortOrder;
        const [total, items] = await Promise.all([
            this.db.product.count({ where }),
            this.db.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    category: true,
                    competitorPriceRecords: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                }
            })
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async create(data) {
        return this.db.product.create({ data });
    }
    async update(id, data) {
        return this.db.product.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await this.db.product.delete({
            where: { id }
        });
        return true;
    }
}
exports.ProductRepository = ProductRepository;
/**
 * Prisma implementation of Category Repository.
 */
class CategoryRepository extends common_1.BaseRepository {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    async findById(id) {
        return this.db.category.findUnique({
            where: { id }
        });
    }
    async findBySlug(slug) {
        return this.db.category.findUnique({
            where: { slug }
        });
    }
    async findAll() {
        return this.db.category.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async create(data) {
        return this.db.category.create({ data });
    }
    async update(id, data) {
        return this.db.category.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        await this.db.category.delete({
            where: { id }
        });
        return true;
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=product.repository.js.map