import { Router } from 'express';
import {
  ValidationMiddleware,
  AuthMiddleware,
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema
} from '@ecommerce/common';
import { AuthController } from '../controllers/auth.controller';

/**
 * Express router builder for authentication and profile routes.
 */
export class AuthRouter {
  private readonly router: Router;
  private readonly controller: AuthController;
  private readonly authMiddleware: AuthMiddleware;

  constructor(controller: AuthController, authMiddleware: AuthMiddleware = new AuthMiddleware()) {
    this.router = Router();
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post(
      '/register',
      ValidationMiddleware.validateBody(RegisterSchema),
      this.controller.register
    );

    this.router.post(
      '/login',
      ValidationMiddleware.validateBody(LoginSchema),
      this.controller.login
    );

    this.router.post(
      '/refresh',
      ValidationMiddleware.validateBody(RefreshTokenSchema),
      this.controller.refresh
    );

    this.router.post(
      '/logout',
      this.authMiddleware.authenticate(),
      this.controller.logout
    );

    this.router.get(
      '/me',
      this.authMiddleware.authenticate(),
      this.controller.getMe
    );

    this.router.get('/oauth/google', this.controller.oauthGoogle);
    this.router.get('/oauth/github', this.controller.oauthGithub);
  }

  public getRouter(): Router {
    return this.router;
  }
}
