import { Request, Response } from 'express';
import { BaseController } from '@ecommerce/common';
import { ScraperService } from '../services/scraper.service';
/**
 * Controller handling competitor price extraction requests and mock competitor page rendering.
 */
export declare class ScraperController extends BaseController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    syncProduct: (req: Request, res: Response) => Promise<Response>;
    syncAll: (req: Request, res: Response) => Promise<Response>;
    getComparison: (req: Request, res: Response) => Promise<Response>;
    renderMockCompetitorPage: (req: Request, res: Response) => void;
}
//# sourceMappingURL=scraper.controller.d.ts.map