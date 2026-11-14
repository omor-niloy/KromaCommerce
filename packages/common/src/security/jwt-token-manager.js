"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const domain_errors_1 = require("../errors/domain-errors");
/**
 * Service class managing JSON Web Token (JWT) signing, verification, and rotation.
 */
class JwtTokenManager {
    accessSecret;
    refreshSecret;
    accessExpiry;
    refreshExpiry;
    constructor(accessSecret = process.env['JWT_ACCESS_SECRET'] || 'default-access-secret-32-chars-long-minimum', refreshSecret = process.env['JWT_REFRESH_SECRET'] || 'default-refresh-secret-32-chars-long-minimum', accessExpiry = '15m', refreshExpiry = '7d') {
        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
        this.accessExpiry = accessExpiry;
        this.refreshExpiry = refreshExpiry;
    }
    /**
     * Generates a signed access token.
     */
    generateAccessToken(payload) {
        const options = { expiresIn: this.accessExpiry };
        return jsonwebtoken_1.default.sign(payload, this.accessSecret, options);
    }
    /**
     * Generates a signed refresh token.
     */
    generateRefreshToken(payload) {
        const options = { expiresIn: this.refreshExpiry };
        return jsonwebtoken_1.default.sign(payload, this.refreshSecret, options);
    }
    /**
     * Generates both access and refresh tokens.
     */
    generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }
    /**
     * Verifies an access token and returns the decoded payload.
     */
    verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.accessSecret);
        }
        catch {
            throw new domain_errors_1.UnauthorizedError('Invalid or expired access token');
        }
    }
    /**
     * Verifies a refresh token and returns the decoded payload.
     */
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.refreshSecret);
        }
        catch {
            throw new domain_errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
    }
}
exports.JwtTokenManager = JwtTokenManager;
//# sourceMappingURL=jwt-token-manager.js.map