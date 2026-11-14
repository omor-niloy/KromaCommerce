"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFilterSchema = exports.UpdateProductSchema = exports.CreateProductSchema = exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Category name must have at least 2 characters'),
    slug: zod_1.z.string().min(2, 'Category slug must have at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: zod_1.z.string().optional()
});
exports.CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Product name must have at least 2 characters'),
    slug: zod_1.z.string().min(2, 'Slug must have at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: zod_1.z.string().min(5, 'Description must have at least 5 characters'),
    price: zod_1.z.number().positive('Price must be greater than zero'),
    inventoryCount: zod_1.z.number().int().nonnegative('Inventory count must be a non-negative integer'),
    imageUrl: zod_1.z.string().url('Image URL must be a valid URL'),
    categoryId: zod_1.z.string().uuid('Category ID must be a valid UUID'),
    competitorUrl: zod_1.z.string().url('Competitor URL must be a valid URL').optional().nullable()
});
exports.UpdateProductSchema = exports.CreateProductSchema.partial();
exports.ProductFilterSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10),
    search: zod_1.z.string().optional(),
    categorySlug: zod_1.z.string().optional(),
    minPrice: zod_1.z.coerce.number().nonnegative().optional(),
    maxPrice: zod_1.z.coerce.number().positive().optional(),
    sortBy: zod_1.z.enum(['price', 'createdAt', 'name']).optional().default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
});
//# sourceMappingURL=product.schemas.js.map