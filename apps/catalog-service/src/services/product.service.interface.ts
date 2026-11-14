import {
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  ProductFilterInput
} from '@ecommerce/common';
import { Product, Category } from '@ecommerce/database';
import {
  ProductWithDetails,
  PaginatedProductsResult
} from '../repositories/product.repository.interface';

/**
 * Interface contract for Product & Category management logic.
 */
export interface IProductService {
  listProducts(query: ProductFilterInput): Promise<PaginatedProductsResult>;
  getProduct(idOrSlug: string): Promise<ProductWithDetails>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  listCategories(): Promise<Category[]>;
  createCategory(input: CreateCategoryInput): Promise<Category>;
}
