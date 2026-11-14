"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Authentication business logic service managing user registration, credential checks, and token lifecycle.
 */
class AuthService extends common_1.BaseService {
    userRepo;
    passwordHasher;
    tokenManager;
    constructor(userRepo, passwordHasher = new common_1.PasswordHasher(), tokenManager = new common_1.JwtTokenManager()) {
        super();
        this.userRepo = userRepo;
        this.passwordHasher = passwordHasher;
        this.tokenManager = tokenManager;
    }
    async register(input) {
        const existing = await this.userRepo.findByEmail(input.email);
        if (existing) {
            throw new common_1.ConflictError('A user with this email address already exists');
        }
        const passwordHash = await this.passwordHasher.hash(input.password);
        const user = await this.userRepo.create({
            email: input.email,
            name: input.name,
            passwordHash,
            role: input.role
        });
        const tokens = this.tokenManager.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const refreshTokenHash = await this.passwordHasher.hash(tokens.refreshToken);
        await this.userRepo.updateRefreshTokenHash(user.id, refreshTokenHash);
        return {
            user: this.mapToProfile(user),
            tokens
        };
    }
    async login(input) {
        const user = await this.userRepo.findByEmail(input.email);
        if (!user) {
            throw new common_1.UnauthorizedError('Invalid email or password');
        }
        const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedError('Invalid email or password');
        }
        const tokens = this.tokenManager.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const refreshTokenHash = await this.passwordHasher.hash(tokens.refreshToken);
        await this.userRepo.updateRefreshTokenHash(user.id, refreshTokenHash);
        return {
            user: this.mapToProfile(user),
            tokens
        };
    }
    async refreshTokens(refreshToken) {
        const payload = this.tokenManager.verifyRefreshToken(refreshToken);
        const user = await this.userRepo.findById(payload.userId);
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedError('Session revoked or user not found');
        }
        const matches = await this.passwordHasher.compare(refreshToken, user.refreshTokenHash);
        if (!matches) {
            throw new common_1.UnauthorizedError('Invalid refresh token');
        }
        const newTokens = this.tokenManager.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const newHash = await this.passwordHasher.hash(newTokens.refreshToken);
        await this.userRepo.updateRefreshTokenHash(user.id, newHash);
        return newTokens;
    }
    async logout(userId) {
        await this.userRepo.updateRefreshTokenHash(userId, null);
    }
    async getUserProfile(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new common_1.NotFoundError('User profile not found');
        }
        return this.mapToProfile(user);
    }
    mapToProfile(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map