import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { GatewayApp } from '@ecommerce/gateway';

/**
 * Acceptance test suite verifying API Gateway edge routing, health status, and security policies.
 */
describe('Gateway API Acceptance Tests', () => {
  let gatewayApp: GatewayApp;

  beforeAll(() => {
    process.env['CONSOLIDATED_MODE'] = 'true';
    gatewayApp = new GatewayApp();
  });

  describe('GET /health', () => {
    it('should return 200 OK with operational gateway status', async () => {
      const response = await request(gatewayApp.app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'api-gateway');
      expect(response.body).toHaveProperty('mode');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('CORS and Security Headers', () => {
    it('should set CORS headers for whitelisted local development origin', async () => {
      const response = await request(gatewayApp.app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should reject requests with forbidden non-whitelisted origins', async () => {
      const response = await request(gatewayApp.app)
        .get('/health')
        .set('Origin', 'https://malicious-external-site.com');

      expect(response.status).toBe(500);
    });

    it('should include rate limiting metadata headers on standard requests', async () => {
      const response = await request(gatewayApp.app).get('/health');

      expect(response.status).toBe(200);
      const rateLimitHeader = response.headers['ratelimit'] || response.headers['ratelimit-policy'] || response.headers['ratelimit-limit'];
      expect(rateLimitHeader).toBeDefined();
    });
  });
});
