import { Request, Response } from 'express';
import { BaseController } from '@ecommerce/common';
import { IProductService } from '../services/product.service.interface';

/**
 * Controller handling HTTP requests for products and categories.
 */
export class ProductController extends BaseController {
  private readonly productService: IProductService;

  constructor(productService: IProductService) {
    super();
    this.productService = productService;
  }

  public getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.productService.listProducts(req.query as any);
      return this.sendPaginated(res, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idOrSlug } = req.params;
      const product = await this.productService.getProduct(idOrSlug as string);
      return this.sendSuccess(res, product);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const product = await this.productService.createProduct(req.body);
      return this.sendCreated(res, product);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public updateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id as string, req.body);
      return this.sendSuccess(res, product);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id as string);
      return this.sendNoContent(res);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getCategories = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await this.productService.listCategories();
      return this.sendSuccess(res, categories);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = await this.productService.createCategory(req.body);
      return this.sendCreated(res, category);
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
