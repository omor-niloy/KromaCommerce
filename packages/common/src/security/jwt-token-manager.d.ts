import { TokenPayload, AuthTokens } from '../interfaces/auth.interface';
/**
 * Service class managing JSON Web Token (JWT) signing, verification, and rotation.
 */
export declare class JwtTokenManager {
    private readonly accessSecret;
    private readonly refreshSecret;
    private readonly accessExpiry;
    private readonly refreshExpiry;
    constructor(accessSecret?: string, refreshSecret?: string, accessExpiry?: string, refreshExpiry?: string);
    /**
     * Generates a signed access token.
     */
    generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string;
    /**
     * Generates a signed refresh token.
     */
    generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string;
    /**
     * Generates both access and refresh tokens.
     */
    generateTokens(payload: Omit<TokenPayload, 'iat' | 'exp'>): AuthTokens;
    /**
     * Verifies an access token and returns the decoded payload.
     */
    verifyAccessToken(token: string): TokenPayload;
    /**
     * Verifies a refresh token and returns the decoded payload.
     */
    verifyRefreshToken(token: string): TokenPayload;
}
//# sourceMappingURL=jwt-token-manager.d.ts.map