import { PrismaClient, Product, Category, Prisma } from '@ecommerce/database';
import { BaseRepository, ProductFilterQuery } from '@ecommerce/common';
import { IProductRepository, ICategoryRepository, ProductWithDetails, PaginatedProductsResult } from './product.repository.interface';
/**
 * Prisma implementation of Product Repository.
 */
export declare class ProductRepository extends BaseRepository<Product> implements IProductRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findById(id: string): Promise<Product | null>;
    findDetailsById(id: string): Promise<ProductWithDetails | null>;
    findBySlug(slug: string): Promise<ProductWithDetails | null>;
    findAll(): Promise<Product[]>;
    findWithFilters(filters: ProductFilterQuery): Promise<PaginatedProductsResult>;
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
    delete(id: string): Promise<boolean>;
}
/**
 * Prisma implementation of Category Repository.
 */
export declare class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findById(id: string): Promise<Category | null>;
    findBySlug(slug: string): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=product.repository.d.ts.map