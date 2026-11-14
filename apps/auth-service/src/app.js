"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApp = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("@ecommerce/common");
const database_1 = require("@ecommerce/database");
const user_repository_1 = require("./repositories/user.repository");
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_routes_1 = require("./routes/auth.routes");
/**
 * Express Application setup class for Auth microservice.
 */
class AuthApp {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
            credentials: true
        }));
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
    }
    setupRoutes() {
        const prisma = database_1.DatabaseConnection.getInstance();
        const userRepo = new user_repository_1.UserRepository(prisma);
        const authService = new auth_service_1.AuthService(userRepo);
        const authController = new auth_controller_1.AuthController(authService);
        const authRouter = new auth_routes_1.AuthRouter(authController);
        this.app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok', service: 'auth-service' });
        });
        this.app.use('/api/v1/auth', authRouter.getRouter());
    }
    setupErrorHandling() {
        this.app.use(common_1.ErrorHandlerMiddleware.handle);
    }
}
exports.AuthApp = AuthApp;
//# sourceMappingURL=app.js.map