import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload, AuthTokens } from '../interfaces/auth.interface';
import { UnauthorizedError } from '../errors/domain-errors';

/**
 * Service class managing JSON Web Token (JWT) signing, verification, and rotation.
 */
export class JwtTokenManager {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiry: string;

  constructor(
    accessSecret: string = process.env['JWT_ACCESS_SECRET'] || 'default-access-secret-32-chars-long-minimum',
    refreshSecret: string = process.env['JWT_REFRESH_SECRET'] || 'default-refresh-secret-32-chars-long-minimum',
    accessExpiry = '15m',
    refreshExpiry = '7d'
  ) {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiry = accessExpiry;
    this.refreshExpiry = refreshExpiry;
  }

  /**
   * Generates a signed access token.
   */
  public generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = { expiresIn: this.accessExpiry as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.accessSecret, options);
  }

  /**
   * Generates a signed refresh token.
   */
  public generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = { expiresIn: this.refreshExpiry as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.refreshSecret, options);
  }

  /**
   * Generates both access and refresh tokens.
   */
  public generateTokens(payload: Omit<TokenPayload, 'iat' | 'exp'>): AuthTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Verifies an access token and returns the decoded payload.
   */
  public verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  /**
   * Verifies a refresh token and returns the decoded payload.
   */
  public verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}
