import { Router } from 'express';
import {
  ValidationMiddleware,
  AuthMiddleware,
  ProductFilterSchema,
  CreateProductSchema,
  UpdateProductSchema,
  CreateCategorySchema
} from '@ecommerce/common';
import { ProductController } from '../controllers/product.controller';

/**
 * Express router builder for products and categories.
 */
export class CatalogRouter {
  private readonly router: Router;
  private readonly controller: ProductController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(
    controller: ProductController,
    authMiddleware: AuthMiddleware = new AuthMiddleware()
  ) {
    this.router = Router();
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get(
      '/products',
      ValidationMiddleware.validateQuery(ProductFilterSchema),
      this.controller.getProducts
    );

    this.router.get('/products/:idOrSlug', this.controller.getProduct);

    this.router.post(
      '/products',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      ValidationMiddleware.validateBody(CreateProductSchema),
      this.controller.createProduct
    );

    this.router.put(
      '/products/:id',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      ValidationMiddleware.validateBody(UpdateProductSchema),
      this.controller.updateProduct
    );

    this.router.delete(
      '/products/:id',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      this.controller.deleteProduct
    );

    this.router.get('/categories', this.controller.getCategories);

    this.router.post(
      '/categories',
      this.authMiddleware.authenticate(),
      this.authMiddleware.requireRole('ADMIN'),
      ValidationMiddleware.validateBody(CreateCategorySchema),
      this.controller.createCategory
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
