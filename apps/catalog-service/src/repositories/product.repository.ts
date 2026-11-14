import { PrismaClient, Product, Category, Prisma } from '@ecommerce/database';
import { BaseRepository, ProductFilterQuery } from '@ecommerce/common';
import {
  IProductRepository,
  ICategoryRepository,
  ProductWithDetails,
  PaginatedProductsResult
} from './product.repository.interface';

/**
 * Prisma implementation of Product Repository.
 */
export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    super();
    this.db = db;
  }

  public async findById(id: string): Promise<Product | null> {
    return this.db.product.findUnique({
      where: { id }
    });
  }

  public async findDetailsById(id: string): Promise<ProductWithDetails | null> {
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

  public async findBySlug(slug: string): Promise<ProductWithDetails | null> {
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

  public async findAll(): Promise<Product[]> {
    return this.db.product.findMany();
  }

  public async findWithFilters(filters: ProductFilterQuery): Promise<PaginatedProductsResult> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

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

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
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

  public async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.db.product.create({ data });
  }

  public async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.db.product.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.db.product.delete({
      where: { id }
    });
    return true;
  }
}

/**
 * Prisma implementation of Category Repository.
 */
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    super();
    this.db = db;
  }

  public async findById(id: string): Promise<Category | null> {
    return this.db.category.findUnique({
      where: { id }
    });
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    return this.db.category.findUnique({
      where: { slug }
    });
  }

  public async findAll(): Promise<Category[]> {
    return this.db.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  public async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.db.category.create({ data });
  }

  public async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.db.category.update({
      where: { id },
      data
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.db.category.delete({
      where: { id }
    });
    return true;
  }
}
