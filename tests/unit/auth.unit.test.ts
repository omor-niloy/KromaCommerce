import { describe, it, expect } from 'vitest';
import {
  PasswordHasher,
  JwtTokenManager,
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  UnauthorizedError
} from '@ecommerce/common';

/**
 * Unit test suite verifying Auth domain security components and Zod validation schemas.
 */
describe('Auth Unit Tests', () => {
  describe('PasswordHasher', () => {
    const hasher = new PasswordHasher(10);

    it('should correctly hash a plaintext password', async () => {
      const rawPassword = 'SecurePassword123!';
      const hash = await hasher.hash(rawPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toEqual(rawPassword);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should return true when verifying the correct password against hash', async () => {
      const rawPassword = 'CorrectHorseBatteryStaple!';
      const hash = await hasher.hash(rawPassword);

      const isValid = await hasher.compare(rawPassword, hash);
      expect(isValid).toBe(true);
    });

    it('should return false when verifying an incorrect password', async () => {
      const rawPassword = 'ValidPassword1!';
      const wrongPassword = 'WrongPassword2!';
      const hash = await hasher.hash(rawPassword);

      const isValid = await hasher.compare(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should generate distinct hashes for identical passwords due to salt generation', async () => {
      const password = 'IdenticalPassword99!';
      const hash1 = await hasher.hash(password);
      const hash2 = await hasher.hash(password);

      expect(hash1).not.toEqual(hash2);
      expect(await hasher.compare(password, hash1)).toBe(true);
      expect(await hasher.compare(password, hash2)).toBe(true);
    });
  });

  describe('JwtTokenManager', () => {
    const accessSecret = 'test-super-secret-access-token-key-32chars';
    const refreshSecret = 'test-super-secret-refresh-token-key-32chars';
    const tokenManager = new JwtTokenManager(accessSecret, refreshSecret, '15m', '7d');

    const testPayload = {
      sub: 'usr_12345678-abcd-ef01-2345-6789abcdef01',
      email: 'alex@kromacommerce.com',
      role: 'CUSTOMER' as const
    };

    it('should generate and verify a valid access token', () => {
      const token = tokenManager.generateAccessToken(testPayload);
      expect(typeof token).toBe('string');

      const decoded = tokenManager.verifyAccessToken(token);
      expect(decoded.sub).toEqual(testPayload.sub);
      expect(decoded.email).toEqual(testPayload.email);
      expect(decoded.role).toEqual('CUSTOMER');
      expect(decoded.exp).toBeDefined();
    });

    it('should generate and verify a valid refresh token', () => {
      const token = tokenManager.generateRefreshToken(testPayload);
      expect(typeof token).toBe('string');

      const decoded = tokenManager.verifyRefreshToken(token);
      expect(decoded.sub).toEqual(testPayload.sub);
      expect(decoded.email).toEqual(testPayload.email);
    });

    it('should generate token pair simultaneously', () => {
      const tokens = tokenManager.generateTokens(testPayload);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      const decodedAccess = tokenManager.verifyAccessToken(tokens.accessToken);
      const decodedRefresh = tokenManager.verifyRefreshToken(tokens.refreshToken);
      expect(decodedAccess.sub).toEqual(testPayload.sub);
      expect(decodedRefresh.sub).toEqual(testPayload.sub);
    });

    it('should reject access token signed with an invalid secret', () => {
      const foreignManager = new JwtTokenManager('different-secret-key-that-does-not-match', refreshSecret);
      const foreignToken = foreignManager.generateAccessToken(testPayload);

      expect(() => tokenManager.verifyAccessToken(foreignToken)).toThrow(UnauthorizedError);
    });

    it('should reject malformed or tampered token strings', () => {
      expect(() => tokenManager.verifyAccessToken('not.a.valid.jwt.token')).toThrow(UnauthorizedError);
      expect(() => tokenManager.verifyRefreshToken('completely-invalid-token')).toThrow(UnauthorizedError);
    });

    it('should reject expired access tokens', async () => {
      const fastExpiringManager = new JwtTokenManager(accessSecret, refreshSecret, '1ms', '1ms');
      const token = fastExpiringManager.generateAccessToken(testPayload);

      await new Promise((resolve) => setTimeout(resolve, 15));

      expect(() => fastExpiringManager.verifyAccessToken(token)).toThrow(UnauthorizedError);
    });
  });

  describe('Zod Validation Schemas', () => {
    describe('RegisterSchema', () => {
      it('should validate a valid registration payload and default role to CUSTOMER', () => {
        const payload = {
          email: 'valid.customer@kroma.test',
          password: 'Password123!',
          name: 'Jane Doe'
        };

        const result = RegisterSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.role).toBe('CUSTOMER');
          expect(result.data.email).toBe(payload.email);
          expect(result.data.name).toBe(payload.name);
        }
      });

      it('should allow explicit ADMIN role assignment', () => {
        const payload = {
          email: 'admin.user@kroma.test',
          password: 'AdminPassword123!',
          name: 'Admin User',
          role: 'ADMIN'
        };

        const result = RegisterSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.role).toBe('ADMIN');
        }
      });

      it('should reject invalid email formats', () => {
        const payload = {
          email: 'invalid-email-format',
          password: 'Password123!',
          name: 'Jane Doe'
        };

        const result = RegisterSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });

      it('should reject passwords shorter than 6 characters', () => {
        const payload = {
          email: 'user@kroma.test',
          password: '12345',
          name: 'Jane Doe'
        };

        const result = RegisterSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });

      it('should reject names shorter than 2 characters', () => {
        const payload = {
          email: 'user@kroma.test',
          password: 'Password123!',
          name: 'A'
        };

        const result = RegisterSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe('LoginSchema', () => {
      it('should validate valid credentials', () => {
        const payload = {
          email: 'valid.user@kroma.test',
          password: 'ValidPassword123!'
        };

        const result = LoginSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it('should reject empty or missing password', () => {
        const payload = {
          email: 'valid.user@kroma.test',
          password: ''
        };

        const result = LoginSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });

      it('should reject missing email', () => {
        const payload = {
          password: 'ValidPassword123!'
        };

        const result = LoginSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe('RefreshTokenSchema', () => {
      it('should accept valid token string', () => {
        const payload = { refreshToken: 'valid-refresh-token-string' };
        const result = RefreshTokenSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it('should accept empty payload when token is delivered via cookie', () => {
        const payload = {};
        const result = RefreshTokenSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    });
  });
});
