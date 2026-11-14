import { Request, Response } from 'express';
import { BaseController } from '@ecommerce/common';
import { IProductService } from '../services/product.service.interface';
/**
 * Controller handling HTTP requests for products and categories.
 */
export declare class ProductController extends BaseController {
    private readonly productService;
    constructor(productService: IProductService);
    getProducts: (req: Request, res: Response) => Promise<Response>;
    getProduct: (req: Request, res: Response) => Promise<Response>;
    createProduct: (req: Request, res: Response) => Promise<Response>;
    updateProduct: (req: Request, res: Response) => Promise<Response>;
    deleteProduct: (req: Request, res: Response) => Promise<Response>;
    getCategories: (_req: Request, res: Response) => Promise<Response>;
    createCategory: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=product.controller.d.ts.map