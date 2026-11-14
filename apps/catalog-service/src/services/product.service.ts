import {
  BaseService,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  ProductFilterInput,
  NotFoundError,
  ConflictError
} from '@ecommerce/common';
import { Product, Category } from '@ecommerce/database';
import {
  IProductRepository,
  ICategoryRepository,
  ProductWithDetails,
  PaginatedProductsResult
} from '../repositories/product.repository.interface';
import { IProductService } from './product.service.interface';

/**
 * Service orchestrating product and category retrieval, creation, and mutations.
 */
export class ProductService extends BaseService implements IProductService {
  private readonly productRepo: IProductRepository;
  private readonly categoryRepo: ICategoryRepository;

  constructor(productRepo: IProductRepository, categoryRepo: ICategoryRepository) {
    super();
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
  }

  public async listProducts(query: ProductFilterInput): Promise<PaginatedProductsResult> {
    return this.productRepo.findWithFilters(query);
  }

  public async getProduct(idOrSlug: string): Promise<ProductWithDetails> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let product: ProductWithDetails | null = null;

    if (isUuid) {
      product = await this.productRepo.findDetailsById(idOrSlug);
    }

    if (!product) {
      product = await this.productRepo.findBySlug(idOrSlug);
    }

    if (!product) {
      throw new NotFoundError(`Product '${idOrSlug}' not found`);
    }

    return product;
  }

  public async createProduct(input: CreateProductInput): Promise<Product> {
    const existing = await this.productRepo.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError(`Product with slug '${input.slug}' already exists`);
    }

    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new NotFoundError(`Category with ID '${input.categoryId}' not found`);
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

  public async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError(`Product '${id}' not found`);
    }

    if (input.slug && input.slug !== product.slug) {
      const existing = await this.productRepo.findBySlug(input.slug);
      if (existing) {
        throw new ConflictError(`Product with slug '${input.slug}' already exists`);
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

  public async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError(`Product '${id}' not found`);
    }
    await this.productRepo.delete(id);
  }

  public async listCategories(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }

  public async createCategory(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepo.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError(`Category with slug '${input.slug}' already exists`);
    }

    return this.categoryRepo.create({
      name: input.name,
      slug: input.slug,
      description: input.description || null
    });
  }
}
