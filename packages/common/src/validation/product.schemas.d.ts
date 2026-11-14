import { z } from 'zod';
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
}>;
export declare const CreateProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    inventoryCount: z.ZodNumber;
    imageUrl: z.ZodString;
    categoryId: z.ZodString;
    competitorUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    price: number;
    name: string;
    slug: string;
    description: string;
    inventoryCount: number;
    imageUrl: string;
    categoryId: string;
    competitorUrl?: string | null | undefined;
}, {
    price: number;
    name: string;
    slug: string;
    description: string;
    inventoryCount: number;
    imageUrl: string;
    categoryId: string;
    competitorUrl?: string | null | undefined;
}>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    inventoryCount: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    competitorUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    price?: number | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    inventoryCount?: number | undefined;
    imageUrl?: string | undefined;
    categoryId?: string | undefined;
    competitorUrl?: string | null | undefined;
}, {
    price?: number | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    inventoryCount?: number | undefined;
    imageUrl?: string | undefined;
    categoryId?: string | undefined;
    competitorUrl?: string | null | undefined;
}>;
export declare const ProductFilterSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["price", "createdAt", "name"]>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "price" | "createdAt" | "name";
    sortOrder: "asc" | "desc";
    search?: string | undefined;
    categorySlug?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    categorySlug?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    sortBy?: "price" | "createdAt" | "name" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;
//# sourceMappingURL=product.schemas.d.ts.map