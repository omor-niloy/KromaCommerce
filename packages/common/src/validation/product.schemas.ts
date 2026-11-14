import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Category name must have at least 2 characters'),
  slug: z.string().min(2, 'Category slug must have at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional()
});

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Product name must have at least 2 characters'),
  slug: z.string().min(2, 'Slug must have at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(5, 'Description must have at least 5 characters'),
  price: z.number().positive('Price must be greater than zero'),
  inventoryCount: z.number().int().nonnegative('Inventory count must be a non-negative integer'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  competitorUrl: z.string().url('Competitor URL must be a valid URL').optional().nullable()
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductFilterSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  categorySlug: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price', 'createdAt', 'name']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;
