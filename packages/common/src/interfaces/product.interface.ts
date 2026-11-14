/**
 * Product category domain representation.
 */
export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product domain representation.
 */
export interface ProductModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  inventoryCount: number;
  imageUrl: string;
  categoryId: string;
  category?: CategoryModel;
  competitorUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filter and search criteria for querying products.
 */
export interface ProductFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
