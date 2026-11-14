import { IRepository, ProductFilterQuery } from '@ecommerce/common';
import { Product, Category, Prisma } from '@ecommerce/database';
export interface ProductWithDetails extends Product {
    category?: Category;
    competitorPriceRecords?: Array<{
        id: string;
        competitorName: string;
        competitorUrl: string;
        price: number;
        differencePercentage: number;
        createdAt: Date;
    }>;
}
export interface PaginatedProductsResult {
    items: ProductWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
/**
 * Interface contract for Product persistence operations.
 */
export interface IProductRepository extends IRepository<Product> {
    findBySlug(slug: string): Promise<ProductWithDetails | null>;
    findDetailsById(id: string): Promise<ProductWithDetails | null>;
    findWithFilters(filters: ProductFilterQuery): Promise<PaginatedProductsResult>;
    create(data: Prisma.ProductCreateInput): Promise<Product>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
}
/**
 * Interface contract for Category persistence operations.
 */
export interface ICategoryRepository extends IRepository<Category> {
    findBySlug(slug: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
}
//# sourceMappingURL=product.repository.interface.d.ts.map