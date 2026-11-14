import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { AuthApp } from '@ecommerce/auth-service';

/**
 * Acceptance test suite verifying Auth & Identity microservice HTTP endpoints.
 */
describe('Auth Acceptance Tests', () => {
  let authApp: AuthApp;

  beforeAll(() => {
    authApp = new AuthApp();
  });

  describe('POST /api/v1/auth/register', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test.user.${timestamp}@kromacommerce.test`;

    it('should register a new customer account, return 201 Created, and set refreshToken cookie', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
          name: 'Integration Test User',
          role: 'CUSTOMER'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(uniqueEmail);
      expect(response.body.data.user.role).toBe('CUSTOMER');
      expect(response.body.data).toHaveProperty('accessToken');

      const setCookie = response.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const hasRefreshCookie = (setCookie as string[]).some((c) => c.includes('refreshToken='));
      expect(hasRefreshCookie).toBe(true);
    });

    it('should reject registration if email is already registered', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
          name: 'Duplicate Test User'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('already exists');
    });

    it('should reject registration with invalid schema payload', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'short'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should successfully authenticate seeded user and issue tokens', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@kromacommerce.com',
          password: 'Customer123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('customer@kromacommerce.com');
      expect(response.body.data).toHaveProperty('accessToken');

      const setCookie = response.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const hasRefreshCookie = (setCookie as string[]).some((c) => c.includes('refreshToken='));
      expect(hasRefreshCookie).toBe(true);
    });

    it('should reject authentication with incorrect password', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@kromacommerce.com',
          password: 'WrongPassword999!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should reject non-existent user email', async () => {
      const response = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent.user@kromacommerce.com',
          password: 'SomePassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should rotate and return a fresh access token when valid cookie is presented', async () => {
      const loginResponse = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@kromacommerce.com',
          password: 'Customer123!'
        });

      const cookies = loginResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const refreshResponse = await request(authApp.app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', cookies as string[]);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.data).toHaveProperty('accessToken');
    });

    it('should reject token refresh when refresh token is missing', async () => {
      const response = await request(authApp.app).post('/api/v1/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return profile information when authenticated with valid Bearer token', async () => {
      const loginResponse = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@kromacommerce.com',
          password: 'Customer123!'
        });

      const token = loginResponse.body.data.accessToken;

      const profileResponse = await request(authApp.app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data.email).toBe('customer@kromacommerce.com');
      expect(profileResponse.body.data.role).toBe('CUSTOMER');
    });

    it('should return 401 Unauthorized when Authorization header is absent', async () => {
      const response = await request(authApp.app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear refresh token cookie and invalidate session', async () => {
      const loginResponse = await request(authApp.app)
        .post('/api/v1/auth/login')
        .send({
          email: 'customer@kromacommerce.com',
          password: 'Customer123!'
        });

      const token = loginResponse.body.data.accessToken;

      const logoutResponse = await request(authApp.app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);

      const setCookie = logoutResponse.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const clearsCookie = (setCookie as string[]).some((c) => c.includes('refreshToken=;'));
      expect(clearsCookie).toBe(true);
    });
  });
});
