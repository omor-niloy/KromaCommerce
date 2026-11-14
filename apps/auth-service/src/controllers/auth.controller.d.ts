import { Request, Response } from 'express';
import { BaseController } from '@ecommerce/common';
import { IAuthService } from '../services/auth.service.interface';
/**
 * Controller handling user authentication, session refresh, and profile endpoints.
 */
export declare class AuthController extends BaseController {
    private readonly authService;
    constructor(authService: IAuthService);
    register: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    refresh: (req: Request, res: Response) => Promise<Response>;
    logout: (req: Request, res: Response) => Promise<Response>;
    getMe: (req: Request, res: Response) => Promise<Response>;
    oauthGoogle: (_req: Request, res: Response) => Promise<Response>;
    oauthGithub: (_req: Request, res: Response) => Promise<Response>;
    private setRefreshCookie;
}
//# sourceMappingURL=auth.controller.d.ts.map