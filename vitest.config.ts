import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgrespassword@localhost:5432/kromacommerce?sslmode=disable',
      JWT_ACCESS_SECRET: 'test-jwt-access-secret-32-chars-minimum-length',
      JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-32-chars-minimum-length',
      JWT_ACCESS_EXPIRY: '15m',
      JWT_REFRESH_EXPIRY: '7d',
      FRONTEND_URL: 'http://localhost:3000',
      CONSOLIDATED_MODE: 'true',
      PAYMENT_PROVIDER: 'mock',
    },
  },
  resolve: {
    alias: {
      '@ecommerce/common': path.resolve(__dirname, './packages/common/src'),
      '@ecommerce/database': path.resolve(__dirname, './packages/database/src'),
      '@ecommerce/auth-service': path.resolve(__dirname, './apps/auth-service/src'),
      '@ecommerce/catalog-service': path.resolve(__dirname, './apps/catalog-service/src'),
      '@ecommerce/order-service': path.resolve(__dirname, './apps/order-service/src'),
      '@ecommerce/scraper-service': path.resolve(__dirname, './apps/scraper-service/src'),
      '@ecommerce/gateway': path.resolve(__dirname, './apps/gateway/src'),
    },
  },
});
