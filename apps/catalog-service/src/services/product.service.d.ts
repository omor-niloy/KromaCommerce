import { BaseService, CreateProductInput, UpdateProductInput, CreateCategoryInput, ProductFilterInput } from '@ecommerce/common';
import { Product, Category } from '@ecommerce/database';
import { IProductRepository, ICategoryRepository, ProductWithDetails, PaginatedProductsResult } from '../repositories/product.repository.interface';
import { IProductService } from './product.service.interface';
/**
 * Service orchestrating product and category retrieval, creation, and mutations.
 */
export declare class ProductService extends BaseService implements IProductService {
    private readonly productRepo;
    private readonly categoryRepo;
    constructor(productRepo: IProductRepository, categoryRepo: ICategoryRepository);
    listProducts(query: ProductFilterInput): Promise<PaginatedProductsResult>;
    getProduct(idOrSlug: string): Promise<ProductWithDetails>;
    createProduct(input: CreateProductInput): Promise<Product>;
    updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
    listCategories(): Promise<Category[]>;
    createCategory(input: CreateCategoryInput): Promise<Category>;
}
//# sourceMappingURL=product.service.d.ts.map