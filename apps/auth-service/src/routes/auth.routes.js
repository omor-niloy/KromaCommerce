"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const common_1 = require("@ecommerce/common");
/**
 * Express router builder for authentication and profile routes.
 */
class AuthRouter {
    router;
    controller;
    authMiddleware;
    constructor(controller, authMiddleware = new common_1.AuthMiddleware()) {
        this.router = (0, express_1.Router)();
        this.controller = controller;
        this.authMiddleware = authMiddleware;
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/register', common_1.ValidationMiddleware.validateBody(common_1.RegisterSchema), this.controller.register);
        this.router.post('/login', common_1.ValidationMiddleware.validateBody(common_1.LoginSchema), this.controller.login);
        this.router.post('/refresh', common_1.ValidationMiddleware.validateBody(common_1.RefreshTokenSchema), this.controller.refresh);
        this.router.post('/logout', this.authMiddleware.authenticate(), this.controller.logout);
        this.router.get('/me', this.authMiddleware.authenticate(), this.controller.getMe);
        this.router.get('/oauth/google', this.controller.oauthGoogle);
        this.router.get('/oauth/github', this.controller.oauthGithub);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
//# sourceMappingURL=auth.routes.js.map