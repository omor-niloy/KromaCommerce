"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Controller handling user authentication, session refresh, and profile endpoints.
 */
class AuthController extends common_1.BaseController {
    authService;
    constructor(authService) {
        super();
        this.authService = authService;
    }
    register = async (req, res) => {
        try {
            const result = await this.authService.register(req.body);
            this.setRefreshCookie(res, result.tokens.refreshToken);
            return this.sendCreated(res, {
                user: result.user,
                accessToken: result.tokens.accessToken
            });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    login = async (req, res) => {
        try {
            const result = await this.authService.login(req.body);
            this.setRefreshCookie(res, result.tokens.refreshToken);
            return this.sendSuccess(res, {
                user: result.user,
                accessToken: result.tokens.accessToken
            });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    refresh = async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) {
                throw new common_1.UnauthorizedError('Missing refresh token');
            }
            const tokens = await this.authService.refreshTokens(refreshToken);
            this.setRefreshCookie(res, tokens.refreshToken);
            return this.sendSuccess(res, {
                accessToken: tokens.accessToken
            });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    logout = async (req, res) => {
        try {
            if (req.user?.userId) {
                await this.authService.logout(req.user.userId);
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: 'strict'
            });
            return this.sendSuccess(res, { message: 'Logged out successfully' });
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    getMe = async (req, res) => {
        try {
            if (!req.user) {
                throw new common_1.UnauthorizedError('Authentication required');
            }
            const profile = await this.authService.getUserProfile(req.user.userId);
            return this.sendSuccess(res, profile);
        }
        catch (error) {
            return this.handleError(res, error);
        }
    };
    oauthGoogle = async (_req, res) => {
        const clientId = process.env['GOOGLE_CLIENT_ID'] || 'mock-google-client-id';
        const redirectUri = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/api/auth/callback/google`;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
        return this.sendSuccess(res, { redirectUrl: url });
    };
    oauthGithub = async (_req, res) => {
        const clientId = process.env['GITHUB_CLIENT_ID'] || 'mock-github-client-id';
        const redirectUri = `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/api/auth/callback/github`;
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
        return this.sendSuccess(res, { redirectUrl: url });
    };
    setRefreshCookie(res, token) {
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map